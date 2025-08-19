import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserStatus, UserRole } from './entities/user.entity';
import { UserAddress } from './entities/user-address.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserAddressDto, UpdateUserAddressDto } from './dto/user-address.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserAddress)
    private userAddressRepository: Repository<UserAddress>,
  ) {}

  async findAll() {
    return this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'status', 'createdAt', 'lastLoginAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'phone', 'role', 'status', 'preferredLanguage', 'marketingConsent', 'dataProcessingConsent', 'createdAt', 'lastLoginAt'],
      relations: ['addresses'],
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['addresses'],
    });
  }

  async findById(id: string) {
    return this.findOne(id);
  }

  async create(createUserDto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password only if provided
    let hashedPassword = '';
    if (createUserDto.password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    }

    // Create user
    const user = this.userRepository.create({
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phone: createUserDto.phone,
      password: hashedPassword,
      role: (createUserDto.role as any) || UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      preferredLanguage: createUserDto.preferredLanguage,
      dataProcessingConsent: createUserDto.dataProcessingConsent,
      marketingConsent: createUserDto.marketingConsent,
      profilePicture: createUserDto.profilePicture,
      isActive: createUserDto.isActive !== undefined ? createUserDto.isActive : true,
    });

    const savedUser = await this.userRepository.save(user);
    
    // Return user without password
    const { password, ...result } = savedUser;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    
    // Update user
    Object.assign(user, updateUserDto);
    
    const updatedUser = await this.userRepository.save(user);
    
    // Return user without password
    const { password, ...result } = updatedUser;
    return result;
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'password'],
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }
    
    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, saltRounds);
    
    // Update password
    user.password = hashedPassword;
    await this.userRepository.save(user);
    
    return { message: 'Password changed successfully' };
  }

  async deactivate(id: string) {
    const user = await this.findOne(id);
    user.status = UserStatus.INACTIVE;
    
    const updatedUser = await this.userRepository.save(user);
    
    // Return user without password
    const { password, ...result } = updatedUser;
    return result;
  }

  async activate(id: string) {
    const user = await this.findOne(id);
    user.status = UserStatus.ACTIVE;
    
    const updatedUser = await this.userRepository.save(user);
    
    // Return user without password
    const { password, ...result } = updatedUser;
    return result;
  }

  async updateLastLogin(id: string) {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
  }

  // Address management
  async getUserAddresses(userId: string) {
    return this.userAddressRepository.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'ASC' },
    });
  }

  async createUserAddress(userId: string, createAddressDto: CreateUserAddressDto) {
    // If this is set as default, unset other default addresses
    if (createAddressDto.isDefault) {
      await this.userAddressRepository.update(
        { userId, isDefault: true },
        { isDefault: false }
      );
    }

    const address = this.userAddressRepository.create({
      ...createAddressDto,
      userId,
    });

    return this.userAddressRepository.save(address);
  }

  async updateUserAddress(userId: string, addressId: string, updateAddressDto: UpdateUserAddressDto) {
    const address = await this.userAddressRepository.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    // If this is set as default, unset other default addresses
    if (updateAddressDto.isDefault) {
      await this.userAddressRepository.update(
        { userId, isDefault: true },
        { isDefault: false }
      );
    }

    Object.assign(address, updateAddressDto);
    return this.userAddressRepository.save(address);
  }

  async deleteUserAddress(userId: string, addressId: string) {
    const address = await this.userAddressRepository.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    return this.userAddressRepository.remove(address);
  }

  async setDefaultAddress(userId: string, addressId: string) {
    const address = await this.userAddressRepository.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    // Unset other default addresses
    await this.userAddressRepository.update(
      { userId, isDefault: true },
      { isDefault: false }
    );

    // Set this address as default
    address.isDefault = true;
    return this.userAddressRepository.save(address);
  }
}
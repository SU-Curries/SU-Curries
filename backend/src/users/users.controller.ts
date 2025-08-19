import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserAddressDto, UpdateUserAddressDto } from './dto/user-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@GetUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns the user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user (admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateProfile(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    // Remove role and status from update for regular users
    const { role, status, ...allowedUpdates } = updateUserDto;
    return this.usersService.update(user.id, allowedUpdates);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user (admin only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('profile/password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid current password' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  changePassword(@GetUser() user: User, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(user.id, changePasswordDto);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate a user (admin only)' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'User not found' })
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate a user (admin only)' })
  @ApiResponse({ status: 200, description: 'User activated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'User not found' })
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }

  // Address management endpoints
  @Get('profile/addresses')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user addresses' })
  @ApiResponse({ status: 200, description: 'Returns user addresses' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUserAddresses(@GetUser() user: User) {
    return this.usersService.getUserAddresses(user.id);
  }

  @Post('profile/addresses')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new address for current user' })
  @ApiResponse({ status: 201, description: 'Address created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createUserAddress(@GetUser() user: User, @Body() createAddressDto: CreateUserAddressDto) {
    return this.usersService.createUserAddress(user.id, createAddressDto);
  }

  @Patch('profile/addresses/:addressId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user address' })
  @ApiResponse({ status: 200, description: 'Address updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  updateUserAddress(
    @GetUser() user: User,
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: UpdateUserAddressDto
  ) {
    return this.usersService.updateUserAddress(user.id, addressId, updateAddressDto);
  }

  @Delete('profile/addresses/:addressId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user address' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  deleteUserAddress(@GetUser() user: User, @Param('addressId') addressId: string) {
    return this.usersService.deleteUserAddress(user.id, addressId);
  }

  @Patch('profile/addresses/:addressId/default')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set address as default' })
  @ApiResponse({ status: 200, description: 'Default address set successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  setDefaultAddress(@GetUser() user: User, @Param('addressId') addressId: string) {
    return this.usersService.setDefaultAddress(user.id, addressId);
  }
}
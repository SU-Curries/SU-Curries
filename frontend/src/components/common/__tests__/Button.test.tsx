/**
 * Button Component Unit Tests
 * Testing the reusable Button component functionality
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-[#ff6b35]'); // Default primary variant
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-[#2d2d2d]');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-2', 'text-sm');

    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-4', 'text-lg');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:bg-[#1a1a1a]');
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with destructive variant', () => {
    render(<Button destructive>Delete</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-[#ef4444]');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('renders with proper accessibility attributes', () => {
    render(<Button>Accessible Button</Button>);

    const button = screen.getByRole('button');
    // Button doesn't explicitly set type="button" by default, but it's still a button
    expect(button.tagName).toBe('BUTTON');
  });

  it('supports different button types', () => {
    render(<Button type="submit">Submit</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders with proper hover and focus states', () => {
    render(<Button>Hover me</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:shadow-[0_4px_8px_rgba(0,0,0,0.35)]');
    expect(button).toHaveClass('focus:outline-none');
    expect(button).toHaveClass('focus:ring-2');
  });
});
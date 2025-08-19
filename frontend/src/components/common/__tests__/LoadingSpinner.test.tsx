/**
 * LoadingSpinner Component Unit Tests
 * Testing the loading spinner component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders with default props', () => {
    const { container } = render(<LoadingSpinner />);
    
    // Look for the SVG spinner element
    const spinner = container.querySelector('svg');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  it('renders with different sizes', () => {
    const { rerender, container } = render(<LoadingSpinner size="small" />);
    let spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('w-5', 'h-5');

    rerender(<LoadingSpinner size="medium" />);
    spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('w-8', 'h-8');

    rerender(<LoadingSpinner size="large" />);
    spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('w-12', 'h-12');
  });

  it('renders with default medium size when no size specified', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('w-8', 'h-8');
  });

  it('has proper default styling', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('text-accent-color');
    expect(spinner).toHaveClass('animate-spin');
  });

  it('renders SVG with proper structure', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('svg');
    expect(spinner?.tagName).toBe('svg');
    expect(spinner).toHaveAttribute('viewBox', '0 0 24 24');
    expect(spinner).toHaveAttribute('fill', 'none');
  });

  it('contains circle and path elements', () => {
    const { container } = render(<LoadingSpinner />);
    
    const circle = container.querySelector('circle');
    const path = container.querySelector('path');
    
    expect(circle).toBeInTheDocument();
    expect(path).toBeInTheDocument();
    expect(circle).toHaveClass('opacity-25');
    expect(path).toHaveClass('opacity-75');
  });

  it('handles size prop correctly', () => {
    const { rerender, container } = render(<LoadingSpinner size="small" />);
    expect(container.querySelector('svg')).toHaveClass('w-5', 'h-5');

    rerender(<LoadingSpinner size="large" />);
    expect(container.querySelector('svg')).toHaveClass('w-12', 'h-12');
  });
});
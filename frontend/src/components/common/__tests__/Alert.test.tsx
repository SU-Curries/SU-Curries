/**
 * Alert Component Unit Tests
 * Testing the alert/notification component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Alert from '../Alert';

describe('Alert Component', () => {
  it('renders with success type', () => {
    const { container } = render(<Alert type="success" message="Success message" />);
    
    const alert = screen.getByText('Success message');
    expect(alert).toBeInTheDocument();
    
    // Get the root container (outermost div)
    const rootContainer = container.firstChild;
    expect(rootContainer).toHaveClass('bg-green-50', 'text-green-800', 'border-green-200');
  });

  it('renders with different types', () => {
    const { rerender, container } = render(<Alert type="success" message="Success message" />);
    let rootContainer = container.firstChild;
    expect(rootContainer).toHaveClass('bg-green-50', 'text-green-800', 'border-green-200');

    rerender(<Alert type="error" message="Error message" />);
    rootContainer = container.firstChild;
    expect(rootContainer).toHaveClass('bg-red-50', 'text-red-800', 'border-red-200');

    rerender(<Alert type="warning" message="Warning message" />);
    rootContainer = container.firstChild;
    expect(rootContainer).toHaveClass('bg-yellow-50', 'text-yellow-800', 'border-yellow-200');

    rerender(<Alert type="info" message="Info message" />);
    rootContainer = container.firstChild;
    expect(rootContainer).toHaveClass('bg-blue-50', 'text-blue-800', 'border-blue-200');
  });

  it('applies custom className', () => {
    const { container } = render(<Alert type="info" message="Custom alert" className="custom-alert" />);
    
    const rootContainer = container.firstChild;
    expect(rootContainer).toHaveClass('custom-alert');
  });

  it('has proper default styling', () => {
    const { container } = render(<Alert type="info" message="Styled alert" />);
    
    const rootContainer = container.firstChild;
    expect(rootContainer).toHaveClass('rounded-md', 'border', 'p-4');
  });

  it('renders with proper structure', () => {
    const { container } = render(<Alert type="info" message="Structured alert" />);
    
    const rootContainer = container.firstChild;
    expect(rootContainer).toBeInTheDocument();
    
    // Check for the flex container
    const flexContainer = rootContainer?.querySelector('.flex.items-start');
    expect(flexContainer).toBeInTheDocument();
    
    // Check for the flex-grow div
    const flexGrow = flexContainer?.querySelector('.flex-grow');
    expect(flexGrow).toBeInTheDocument();
  });

  it('renders text content properly', () => {
    render(<Alert type="info" message="Test alert content" />);
    
    const textElement = screen.getByText('Test alert content');
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveClass('text-sm');
  });

  it('renders with close button when onClose is provided', () => {
    const handleClose = jest.fn();
    render(<Alert type="info" message="Closable alert" onClose={handleClose} />);
    
    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
    
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not render close button when onClose is not provided', () => {
    render(<Alert type="info" message="Non-closable alert" />);
    
    const closeButton = screen.queryByRole('button');
    expect(closeButton).not.toBeInTheDocument();
  });

  it('renders React node as message', () => {
    const messageNode = <span>Complex <strong>message</strong> content</span>;
    const { container } = render(<Alert type="info" message={messageNode} />);
    
    // Check that the complex content is rendered
    expect(container.textContent).toContain('Complex message content');
  });
});
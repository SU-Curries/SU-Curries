import React from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const NewsletterSignup = () => {
  return (
    <section className="py-12 bg-secondary-bg">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-text-primary mb-4">Subscribe to our Newsletter</h2>
        <p className="text-text-secondary mb-8">
          Get the latest updates on new products, special offers, and more.
        </p>
        <form className="flex justify-center max-w-lg mx-auto">
          <Input type="email" placeholder="Your email" className="rounded-r-none" />
          <Button variant="primary" className="rounded-l-none">Subscribe</Button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSignup; 
import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const textareaId = id || props.name;
    
    return (
      <div className={clsx('form-field', error && 'form-field--error', className)}>
        {label && (
          <label htmlFor={textareaId} className="form-field__label">
            {label}
            {props.required && <span className="form-field__required">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className="form-field__textarea"
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        {error && (
          <span id={`${textareaId}-error`} className="form-field__error" data-testid="error-message">
            {error}
          </span>
        )}
        {hint && !error && (
          <span className="form-field__hint">{hint}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

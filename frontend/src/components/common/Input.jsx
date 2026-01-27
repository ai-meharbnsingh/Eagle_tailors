import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  labelHindi,
  error,
  hint,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {labelHindi && (
            <span className="text-xs text-gray-400 ml-2">{labelHindi}</span>
          )}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && iconPosition === 'left' && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
            ${icon && iconPosition === 'left' ? 'pl-12' : ''}
            ${icon && iconPosition === 'right' ? 'pr-12' : ''}
            ${error
              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
              : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'
            }
            placeholder-gray-400 text-gray-800
            outline-none
            ${className}
          `}
          {...props}
        />

        {icon && iconPosition === 'right' && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}

      {hint && !error && (
        <p className="mt-2 text-sm text-gray-400">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

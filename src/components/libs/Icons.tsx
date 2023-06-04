import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> &  {
  size?: number;
}

export const ChevronDownIcon = ({
  fill,
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const IconsDefault = ({
  fill,
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
      viewBox="0 0 24 24"
      id="question"
      height={size || height || 24}
      width={size || width || 24}
      {...props}
    >
      <path fill={fill} d="M15.33252,9.5A3.5001,3.5001,0,0,0,8.80127,7.75a1.00016,1.00016,0,0,0,1.73242,1A1.50266,1.50266,0,0,1,11.83252,8a1.5,1.5,0,1,1,0,3h-.00244a.94984.94984,0,0,0-.18927.0387,1.03181,1.03181,0,0,0-.19861.04065.98275.98275,0,0,0-.15552.10485,1.00813,1.00813,0,0,0-.162.10975,1.00464,1.00464,0,0,0-.11706.1737.97789.97789,0,0,0-.09668.14417,1.02252,1.02252,0,0,0-.04285.21191A.94847.94847,0,0,0,10.83252,12v1l.00232.01135.0011.49109a1.00016,1.00016,0,0,0,1,.99756h.00244a1.00006,1.00006,0,0,0,.99756-1.00244l-.00153-.66138A3.49363,3.49363,0,0,0,15.33252,9.5Zm-4.20264,6.79A1,1,0,0,0,11.82959,18a1.036,1.036,0,0,0,.71045-.29,1.01517,1.01517,0,0,0,0-1.41992A1.03425,1.03425,0,0,0,11.12988,16.29Z"></path>
    </svg>
  );
}

export const OrderIcon = ({
  fill,
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
      viewBox="0 0 24 24"
      id="shopping-basket"
      height={size || height || 24}
      width={size || width || 24}
      {...props}
    >
      <path fill={fill} d="M14,18a1,1,0,0,0,1-1V15a1,1,0,0,0-2,0v2A1,1,0,0,0,14,18Zm-4,0a1,1,0,0,0,1-1V15a1,1,0,0,0-2,0v2A1,1,0,0,0,10,18ZM19,6H17.62L15.89,2.55a1,1,0,1,0-1.78.9L15.38,6H8.62L9.89,3.45a1,1,0,0,0-1.78-.9L6.38,6H5a3,3,0,0,0-.92,5.84l.74,7.46a3,3,0,0,0,3,2.7h8.38a3,3,0,0,0,3-2.7l.74-7.46A3,3,0,0,0,19,6ZM17.19,19.1a1,1,0,0,1-1,.9H7.81a1,1,0,0,1-1-.9L6.1,12H17.9ZM19,10H5A1,1,0,0,1,5,8H19a1,1,0,0,1,0,2Z"></path>
    </svg>
  );
}

export const PaymentIcon = ({
  fill,
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
      viewBox="0 0 24 24"
      id="transaction"
      height={size || height || 24}
      width={size || width || 24}
      {...props}
    >
      <path fill={fill} d="M20 2H10a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3Zm1 10a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1Zm-3.5-4a1.49 1.49 0 0 0-1 .39 1.5 1.5 0 1 0 0 2.22 1.5 1.5 0 1 0 1-2.61ZM16 17a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4h1a1 1 0 0 0 0-2H3v-1a1 1 0 0 1 1-1 1 1 0 0 0 0-2 3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1a1 1 0 0 0-1-1ZM6 18h1a1 1 0 0 0 0-2H6a1 1 0 0 0 0 2Z"></path>
    </svg>
  );
}

export const PackageIcon = ({
  fill,
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
      viewBox="0 0 24 24"
      id="package"
      height={size || height || 24}
      width={size || width || 24}
      {...props}
    >
      <path fill={fill} d="M19,2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V5A3,3,0,0,0,19,2ZM10,4h4V7.13l-1.45-1a1,1,0,0,0-1.1,0L10,7.13ZM20,19a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4H8V9a1,1,0,0,0,.53.88,1,1,0,0,0,1-.05L12,8.2l2.45,1.63A1,1,0,0,0,16,9V4h3a1,1,0,0,1,1,1Z"></path>
    </svg>
  );
}

export const FoodIcon = ({
  fill,
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      id="pizza-slice"
      height={size || height || 24}
      width={size || width || 24}
      {...props}
    >
      <path fill={fill} d="M8.51,12.48a1,1,0,1,0,1,1A1,1,0,0,0,8.51,12.48ZM8.51,8a1,1,0,1,0,1,1A1,1,0,0,0,8.51,8ZM12,10a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V11A1,1,0,0,0,12,10Zm8.5-1.43,0,0a3,3,0,0,0-2.3-.29,2.9,2.9,0,0,0-1.09.56L5.51,2.13a1,1,0,0,0-1,0A1,1,0,0,0,4,3V16.17A2.94,2.94,0,0,0,2,19H2a3,3,0,0,0,2.92,3h.58a18.57,18.57,0,0,0,16.11-9.41A3,3,0,0,0,20.51,8.57ZM6,4.73l9.89,5.71A12.57,12.57,0,0,1,6,16Zm13.87,6.88A16.58,16.58,0,0,1,5,20a1,1,0,0,1-1-1,1,1,0,0,1,.3-.72A1,1,0,0,1,5,18h.51a14.5,14.5,0,0,0,12.62-7.37.9.9,0,0,1,.58-.44,1,1,0,0,1,.75.09h0A1,1,0,0,1,19.88,11.61Z"></path>
    </svg>
  );
}

export const BookingIcon = ({
  fill,
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      id="book-alt"
      height={size || height || 24}
      width={size || width || 24}
      {...props}
    >
      <path fill={fill} d="M18,2H8A4,4,0,0,0,4,6V18a4,4,0,0,0,4,4H18a2,2,0,0,0,2-2V4A2,2,0,0,0,18,2ZM6,6A2,2,0,0,1,8,4H18V14H8a3.91,3.91,0,0,0-2,.56ZM8,20a2,2,0,0,1,0-4H18v4ZM10,8h4a1,1,0,0,0,0-2H10a1,1,0,0,0,0,2Z"></path>
    </svg>
  );
}

export const PlusIcon = ({
  fill,
  size,
  width = 24,
  height = 24,
  className,
  ...props
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      id="plus"
      height={size || height || 24}
      width={size || width || 24}
      className={className}
      {...props}
    >
      <path fill={fill} d="M19,11H13V5a1,1,0,0,0-2,0v6H5a1,1,0,0,0,0,2h6v6a1,1,0,0,0,2,0V13h6a1,1,0,0,0,0-2Z"></path>
    </svg>
  );
}
export const LightIcon = ({
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      id="sun"
      aria-hidden="true"
      focusable="false"
      role="presentation"
      height={size || height || 24}
      width={size || width || 24}
      {...props}
    >
      <path fill="currentColor" d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"></path>
    </svg>
  )
}

export const MoonIcon = ({
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      id="moon"
      aria-hidden="true"
      focusable="false"
      role="presentation"
      height={size || height || 24}
      width={size || width || 24}
      {...props}
    >
      <path fill="currentColor" d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"></path>
    </svg>
  )
}

export const CheckIcon = ({
  fill = "currentColor",
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      id="check"
      height={size || height || 24}
      width={size || width || 24}
      {...props}
    >
      <path fill={fill} d="M18.71,7.21a1,1,0,0,0-1.42,0L9.84,14.67,6.71,11.53A1,1,0,1,0,5.29,13l3.84,3.84a1,1,0,0,0,1.42,0l8.16-8.16A1,1,0,0,0,18.71,7.21Z"></path>
    </svg>
  )
}

export const CloseIcon = ({
  fill = "currentColor",
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      id="times"
      height={size || height || 24}
      width={size || width || 24}
      {...props}
    >
      <path fill={fill} d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"></path>
    </svg>
  )
}

export const SuccessIcon = ({
  fill = "currentColor",
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
      viewBox="0 0 24 24"
      id="smile-squint-wink-alt"
      height={size || height || 24}
      width={size || width || 24}
      {...props}
    >
      <path fill={fill} d="M9,11a1,1,0,1,0-1-1A1,1,0,0,0,9,11Zm5.16,1.21a1,1,0,0,0,.71.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.42L14.79,10l.79-.79a1,1,0,1,0-1.42-1.42l-1.5,1.5a1,1,0,0,0,0,1.42ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Zm2.36-5.77a3.76,3.76,0,0,1-4.72,0,1,1,0,0,0-1.28,1.54,5.68,5.68,0,0,0,7.28,0,1,1,0,1,0-1.28-1.54Z"></path>
    </svg>
  )
}

export const FailedIcon = ({
  fill = "currentColor",
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
      viewBox="0 0 24 24"
      id="confused"
      height={size || height || 24}
      width={size || width || 24}
      {...props}
    >
      <path fill={fill} d="M9,9a1,1,0,1,0,1,1A1,1,0,0,0,9,9Zm5.66,4.56-4.19,1.5A1,1,0,0,0,10.8,17a1,1,0,0,0,.34-.06l4.2-1.5a1,1,0,1,0-.68-1.88ZM15,9a1,1,0,1,0,1,1A1,1,0,0,0,15,9ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"></path>
    </svg>
  )
}

export const ArrowLeftIcon = ({
  fill = "currentColor",
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
      viewBox="0 0 24 24"
      id="arrow-left"
      height={size || height || 24}
      width={size || width || 24}
      {...props}
    >
      <path fill={fill} d="M17,11H9.41l3.3-3.29a1,1,0,1,0-1.42-1.42l-5,5a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l5,5a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L9.41,13H17a1,1,0,0,0,0-2Z"></path>
    </svg>
  );
}

export const BanIcon = ({
  fill = "currentColor",
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      id="ban"
      height={size || height || 24}
      width={size || width || 24}
      {...props}
    >
      <path fill={fill} d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,0,1-8-8A7.92,7.92,0,0,1,5.69,7.1L16.9,18.31A7.92,7.92,0,0,1,12,20Zm6.31-3.1L7.1,5.69A7.92,7.92,0,0,1,12,4a8,8,0,0,1,8,8A7.92,7.92,0,0,1,18.31,16.9Z"></path>
    </svg>
  );
}

export const MailIcon = ({
  fill = "currentColor",
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="envelope" height={size || height || 24} width={size || width || 24} {...props}><path fill={fill} d="M19,4H5A3,3,0,0,0,2,7V17a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm-.41,2-5.88,5.88a1,1,0,0,1-1.42,0L5.41,6ZM20,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V7.41l5.88,5.88a3,3,0,0,0,4.24,0L20,7.41Z"></path></svg>
  );
}

export const EyeIcon = ({
  fill = "currentColor",
  size,
  width = 24,
  height = 24,
  className,
  ...props
}: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="eye" height={size || height || 24} width={size || width || 24} className={className} {...props}><path fill={fill} d="M21.92,11.6C19.9,6.91,16.1,4,12,4S4.1,6.91,2.08,11.6a1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20s7.9-2.91,9.92-7.6A1,1,0,0,0,21.92,11.6ZM12,18c-3.17,0-6.17-2.29-7.9-6C5.83,8.29,8.83,6,12,6s6.17,2.29,7.9,6C18.17,15.71,15.17,18,12,18ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z"></path></svg>
  );
}

export const EyeSlashIcon = ({
  fill = "currentColor",
  size,
  width = 24,
  height = 24,
  className,
  ...props
}: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="eye-slash" height={size || height || 24} width={size || width || 24} className={className} {...props}><path fill={fill} d="M10.94,6.08A6.93,6.93,0,0,1,12,6c3.18,0,6.17,2.29,7.91,6a15.23,15.23,0,0,1-.9,1.64,1,1,0,0,0-.16.55,1,1,0,0,0,1.86.5,15.77,15.77,0,0,0,1.21-2.3,1,1,0,0,0,0-.79C19.9,6.91,16.1,4,12,4a7.77,7.77,0,0,0-1.4.12,1,1,0,1,0,.34,2ZM3.71,2.29A1,1,0,0,0,2.29,3.71L5.39,6.8a14.62,14.62,0,0,0-3.31,4.8,1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20a9.26,9.26,0,0,0,5.05-1.54l3.24,3.25a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Zm6.36,9.19,2.45,2.45A1.81,1.81,0,0,1,12,14a2,2,0,0,1-2-2A1.81,1.81,0,0,1,10.07,11.48ZM12,18c-3.18,0-6.17-2.29-7.9-6A12.09,12.09,0,0,1,6.8,8.21L8.57,10A4,4,0,0,0,14,15.43L15.59,17A7.24,7.24,0,0,1,12,18Z"></path></svg>
  );
}

export const CalenderIcon = ({
  fill = "currentColor",
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="calender" height={size || height || 24} width={size || width || 24} {...props}><path fill={fill} d="M19,4H17V3a1,1,0,0,0-2,0V4H9V3A1,1,0,0,0,7,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V12H20Zm0-9H4V7A1,1,0,0,1,5,6H7V7A1,1,0,0,0,9,7V6h6V7a1,1,0,0,0,2,0V6h2a1,1,0,0,1,1,1Z"></path></svg>
  );
}

export const FilterIcon = ({
  fill = "currentColor",
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="filter" height={size || height || 24} width={size || width || 24} {...props}><path fill={fill} d="M19,2H5A3,3,0,0,0,2,5V6.17a3,3,0,0,0,.25,1.2l0,.06a2.81,2.81,0,0,0,.59.86L9,14.41V21a1,1,0,0,0,.47.85A1,1,0,0,0,10,22a1,1,0,0,0,.45-.11l4-2A1,1,0,0,0,15,19V14.41l6.12-6.12a2.81,2.81,0,0,0,.59-.86l0-.06A3,3,0,0,0,22,6.17V5A3,3,0,0,0,19,2ZM13.29,13.29A1,1,0,0,0,13,14v4.38l-2,1V14a1,1,0,0,0-.29-.71L5.41,8H18.59ZM20,6H4V5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1Z"></path></svg>
  );
}

export const SearchIcon = ({
  fill = "currentColor",
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="search" height={size || height || 24} width={size || width || 24} {...props}><path fill={fill} d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z"></path></svg>
  );
}

export const PriceTagIcon = ({
  fill = "currentColor",
  size,
  width = 24,
  height = 24,
  ...props
}: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="pricetag-alt" height={size || height || 24} width={size || width || 24} {...props}><path fill={fill} d="M7,6A1,1,0,1,0,8,7,1,1,0,0,0,7,6Zm14.71,5.78L12.23,2.32A1,1,0,0,0,11.5,2h-6a1,1,0,0,0-.71.29L2.29,4.78A1,1,0,0,0,2,5.49v6a1.05,1.05,0,0,0,.29.71l9.49,9.5a1.05,1.05,0,0,0,.71.29,1,1,0,0,0,.71-.29l8.51-8.51a1,1,0,0,0,.29-.71A1.05,1.05,0,0,0,21.71,11.78Zm-9.22,7.81L4,11.09V5.9L5.9,4h5.18l8.5,8.49Z"></path></svg>
  );
}

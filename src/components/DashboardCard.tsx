
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  "rounded-lg p-6 bg-white border shadow-sm",
  {
    variants: {
      variant: {
        default: "border-gray-200",
        primary: "border-l-4 border-l-crm-blue",
        success: "border-l-4 border-l-crm-green",
        warning: "border-l-4 border-l-crm-orange",
        danger: "border-l-4 border-l-crm-red",
      },
      size: {
        default: "",
        sm: "p-4",
        lg: "p-8",
      },
      animate: {
        true: "card-hover",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animate: true
    }
  }
);

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: number;
    positive: boolean;
  };
  delay?: number;
  animateValue?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  className,
  variant,
  size,
  animate,
  title,
  value,
  icon,
  change,
  delay = 0,
  animateValue = true,
  ...props
}) => {
  const valueRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.fromTo(
      card,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, delay, ease: "power2.out" }
    );

    if (animateValue && valueRef.current && typeof value === 'number') {
      const valueElement = valueRef.current;
      
      gsap.from(valueElement, {
        textContent: 0,
        duration: 1.5,
        delay: delay + 0.2,
        ease: "power2.out",
        snap: { textContent: 1 },
        onUpdate: function() {
          valueElement.innerHTML = Math.round(Number(this.targets()[0].textContent)).toString();
        }
      });
    }
  }, [delay, value, animateValue]);

  return (
    <div 
      ref={cardRef} 
      className={cn(cardVariants({ variant, size, animate, className }))}
      {...props}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <div className="flex items-baseline">
            <div className="text-2xl font-bold text-gray-900" ref={valueRef}>
              {value}
            </div>
            {change && (
              <span className={`ml-2 text-sm font-medium ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
                {change.positive ? '+' : ''}{change.value}%
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className="p-2 bg-gray-50 rounded-full">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;

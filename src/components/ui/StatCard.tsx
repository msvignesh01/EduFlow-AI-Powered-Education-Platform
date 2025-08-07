
import { motion } from 'framer-motion';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Card } from './Card';
import { StatCard as StatCardType } from '../../types';
import { cn, responsive } from '../../utils/cn';
import { useResponsive } from '../../hooks/useResponsive';
import { useMicroInteractions } from '../../hooks/useMicroInteractions';

interface StatCardProps {
  data: StatCardType;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ data, className = '' }) => {
  const { title, value, change, icon } = data;
  const { isLaptop, isDesktop, isLargeDesktop, isUltraWide, is4K } = useResponsive();

  const microInteractions = useMicroInteractions({
    enableHaptic: false,
    onInteraction: (type) => {
      if (type === 'hover') {

      }
    },
  });

  return (
    <motion.div
      className={cn('h-full', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        y: -2,
        transition: { duration: 0.2 }
      }}
      {...microInteractions.handlers}
    >
      <Card className="h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm xl:text-base 2xl:text-base font-medium text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <p className="mt-2 xl:mt-3 2xl:mt-3 text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>

            {change && (
              <motion.div
                className="mt-1 xs:mt-2 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                >
                  {change.type === 'increase' ? (
                    <ArrowUpIcon className={cn(
                      'text-green-500',
                      responsive.desktop.icon.sm
                    )} />
                  ) : (
                    <ArrowDownIcon className={cn(
                      'text-red-500',
                      responsive.desktop.icon.sm
                    )} />
                  )}
                </motion.div>
                <span
                  className={cn(
                    'ml-2 xl:ml-3 2xl:ml-3 text-sm xl:text-base 2xl:text-base font-medium',
                    change.type === 'increase' ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {Math.abs(change.value)}%
                </span>
                <span className="ml-2 xl:ml-3 2xl:ml-3 text-xs xl:text-sm 2xl:text-sm text-gray-500 dark:text-gray-400">
                  from last week
                </span>
              </motion.div>
            )}
          </div>

          {icon && (
            <motion.div
              className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-3 xl:p-4 2xl:p-5"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.1,
                type: 'spring',
                stiffness: 300,
                damping: 20
              }}
              whileHover={{
                scale: 1.05,
                rotate: 2,
                transition: { duration: 0.2 }
              }}
            >
              <div className="text-blue-600 dark:text-blue-400">
                {icon}
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

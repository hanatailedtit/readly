'use client';

import { CommonToastProps } from '@/components/ui/toast/CommonToast/CommonToast';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const ACTION_TYPES = {
  ADD: 'ADD',
  DISMISS: 'dismiss',
  DELETE: 'delete',
  DELETE_ALL: 'delete-all',
} as const;

type ToastStateType = {
  toasts: CommonToastProps[];
};

type ToastAction = {
  id?: string;
  type: (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES];
  props: CommonToastProps;
};

type ToastFunctionParams = {
  closeTime?: number;
  isNotAutoClose?: boolean;
} & CommonToastProps;

let count = 0;
const listeners: Dispatch<SetStateAction<ToastStateType>>[] = [];
let memoryState: ToastStateType = { toasts: [] };

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const reducer = (state: ToastStateType, action: ToastAction) => {
  switch (action.type) {
    case ACTION_TYPES.ADD: {
      return {
        toasts: [
          ...state.toasts,
          { ...action.props, id: action.id, isShow: true },
        ],
      };
    }
    case ACTION_TYPES.DISMISS: {
      return {
        toasts: state.toasts.map((toast) => {
          if (toast.id === action.id) {
            return {
              ...toast,
              isShow: false,
            };
          }
          return toast;
        }),
      };
    }
    case ACTION_TYPES.DELETE: {
      return {
        toasts: state.toasts.filter((toast) => toast.id !== action.id),
      };
    }
    case ACTION_TYPES.DELETE_ALL: {
      return {
        toasts: [],
      };
    }
    default:
      return memoryState;
  }
};

const dispatch = (
  type: ToastAction['type'],
  id?: ToastAction['id'],
  props?: CommonToastProps,
) => {
  memoryState = reducer(memoryState, {
    id,
    type,
    props: { ...props },
  });
  listeners.forEach((listener) => listener(memoryState));
};

const toast = ({
  isNotAutoClose = false,
  closeTime = 3000,
  ...props
}: ToastFunctionParams) => {
  const id = genId();
  dispatch(ACTION_TYPES.ADD, id, props);
  if (isNotAutoClose) return;

  setTimeout(() => {
    dispatch(ACTION_TYPES.DISMISS, id);
  }, closeTime);
};

const deleteToast = (id: ToastAction['id']) => {
  dispatch(ACTION_TYPES.DELETE, id);
};

export const useToast = () => {
  const [toastState, setToastState] = useState<ToastStateType>(memoryState);

  useEffect(() => {
    listeners.push(setToastState);

    const isAllClose = toastState.toasts.every((toast) => !toast.isShow);

    let timer: NodeJS.Timeout;

    if (toastState.toasts.length > 0 && isAllClose) {
      timer = setTimeout(() => {
        dispatch(ACTION_TYPES.DELETE_ALL);
      }, 500);
    }

    return () => {
      const index = listeners.indexOf(setToastState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
      clearTimeout(timer);
    };
  }, [toastState]);

  return {
    ...toastState,
    toast,
    deleteToast,
  };
};

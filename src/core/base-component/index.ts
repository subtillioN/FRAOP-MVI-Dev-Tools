import { useEffect, useRef, useState } from 'react';
import { Option, Some, None, isSome } from '../../utils/option';
import { createSource, StreamSource, StreamDispose, StreamSink } from '../streams';

// Core types
export type Observer<T> = (data: T) => void;
export type Unsubscribe = () => void;

export interface LifecycleEvents {
  mount$: StreamSource<boolean>;
  unmount$: StreamSource<boolean>;
  update$: StreamSource<boolean>;
}

export interface BaseComponentState<S = unknown, P = unknown> {
  state: S;
  props: P;
  subject: StreamSource<S>;
  lifecycle: LifecycleEvents;
  updateState: (newState: Partial<S>) => void;
  updateProps: (newProps: Partial<P>) => void;
  subscribe: (observer: Observer<S>) => StreamDispose;
  subscribeToLifecycle: (event: keyof LifecycleEvents, observer: Observer<unknown>) => StreamDispose;
  emit: (event: string, data: unknown) => void;
}

// Lifecycle hook
export const useLifecycle = () => {
  const lifecycleRef = useRef<Option<LifecycleEvents>>(None);

  if (!isSome(lifecycleRef.current)) {
    lifecycleRef.current = Some({
      mount$: createSource<boolean>(() => () => undefined),
      unmount$: createSource<boolean>(() => () => undefined),
      update$: createSource<boolean>(() => () => undefined)
    });
  }

  useEffect(() => {
    if (isSome(lifecycleRef.current)) {
      const lifecycle = lifecycleRef.current.value;
      lifecycle.mount$.source(1, true);
      return () => {
        lifecycle.unmount$.source(1, true);
      };
    }
  }, []);

  return lifecycleRef;
};

// Stream hook
export const useStream = <S>(initialState: S) => {
  const subjectRef = useRef<Option<StreamSource<S>>>(None);

  if (!isSome(subjectRef.current)) {
    subjectRef.current = Some(createSource<S>((sink: StreamSink<S>) => {
      sink(1, initialState);
      return () => undefined;
    }));
  }

  return subjectRef;
};

// State hook
export const useComponentState = <S>(initialState: S) => {
  const [state, setState] = useState<S>(initialState);
  const streamRef = useStream(initialState);

  const updateState = (newState: Partial<S>): void => {
    setState((prev) => {
      const updated = { ...prev, ...newState };
      if (isSome(streamRef.current)) {
        streamRef.current.value.source(1, updated);
      }
      return updated;
    });
  };

  return { state, updateState, streamRef };
};

// Props hook
export const useComponentProps = <P>(lifecycleRef: React.RefObject<Option<LifecycleEvents>>) => {
  const [props, setProps] = useState<P>({} as P);

  const updateProps = (newProps: Partial<P>): void => {
    setProps((prev) => {
      const updated = { ...prev, ...newProps };
      if (isSome(lifecycleRef.current)) {
        lifecycleRef.current.value.update$.source(1, true);
      }
      return updated;
    });
  };

  return { props, updateProps };
};

// Main hook
export const useBaseComponent = <S, P>(initialState: S): BaseComponentState<S, P> => {
  const lifecycleRef = useLifecycle();
  const { state, updateState, streamRef } = useComponentState(initialState);
  const { props, updateProps } = useComponentProps<P>(lifecycleRef);

  const subscribe = (observer: Observer<S>): StreamDispose => {
    if (!isSome(streamRef.current)) return () => undefined;
    const sink: StreamSink<S> = (type, data) => {
      if (type === 1) observer(data);
    };
    return streamRef.current.value.source(0, sink);
  };

  const subscribeToLifecycle = (
    event: keyof LifecycleEvents,
    observer: Observer<unknown>
  ): StreamDispose => {
    if (!isSome(lifecycleRef.current)) return () => undefined;
    const lifecycle = lifecycleRef.current.value[event];
    if (!lifecycle) {
      throw new Error(`Invalid lifecycle event: ${event}`);
    }
    const sink: StreamSink<boolean> = (type, data) => {
      if (type === 1) observer(data);
    };
    return lifecycle.source(0, sink);
  };

  const emit = (event: string, data: unknown): void => {
    const currentProps = props as { onEvent?: (event: string, data: unknown) => void };
    if (currentProps.onEvent) {
      currentProps.onEvent(event, data);
    }
  };

  return {
    state,
    props,
    subject: isSome(streamRef.current) ? streamRef.current.value : createSource(() => () => undefined),
    lifecycle: isSome(lifecycleRef.current) ? lifecycleRef.current.value : {
      mount$: createSource(() => () => undefined),
      unmount$: createSource(() => () => undefined),
      update$: createSource(() => () => undefined)
    },
    updateState,
    updateProps,
    subscribe,
    subscribeToLifecycle,
    emit
  };
}; 
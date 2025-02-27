// Stream types
export type StreamSink<T> = (type: number, data: T) => void;
export type StreamDispose = () => void;
export type StreamFactory<T> = (sink: StreamSink<T>) => StreamDispose;

export interface StreamSource<T> {
  source: {
    (type: 0, sink: StreamSink<T>): StreamDispose;
    (type: 1, data: T): void;
  };
  update: (value: T) => void;
}

// Type guard for StreamSink
const isStreamSink = <T>(value: unknown): value is StreamSink<T> => {
  return typeof value === 'function';
};

// Stream creation
export const createSource = <T>(factory: StreamFactory<T>): StreamSource<T> => {
  const sinks = new Set<StreamSink<T>>();

  function source(type: 0, sink: StreamSink<T>): StreamDispose;
  function source(type: 1, data: T): void;
  function source(type: number, data: T | StreamSink<T>): StreamDispose | void {
    if (type === 0 && isStreamSink<T>(data)) {
      const dispose = factory(data);
      sinks.add(data);
      return dispose;
    }
    if (type === 1) {
      sinks.forEach(sink => sink(type, data as T));
    }
  }

  const update = (value: T): void => {
    sinks.forEach(sink => sink(1, value));
  };

  return { source, update };
}; 
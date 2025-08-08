type Handler<T> = (event: T) => void;

export class EventEmitter<TEvents extends { type: string }>
{
  private handlers: { [K in TEvents["type"]]?: Handler<Extract<TEvents, { type: K }>>[] } = {};

  on<K extends TEvents["type"]>(type: K, handler: Handler<Extract<TEvents, { type: K }>>): () => void
  {
    const list = (this.handlers[type] ??= [] as any);
    list.push(handler as any);
    return () => this.off(type, handler as any);
  }

  off<K extends TEvents["type"]>(type: K, handler: Handler<Extract<TEvents, { type: K }>>): void
  {
    const list = this.handlers[type];
    if (!list)
    {
      return;
    }
    const idx = list.indexOf(handler as any);
    if (idx >= 0)
    {
      list.splice(idx, 1);
    }
  }

  emit(event: TEvents): void
  {
    const list = this.handlers[event.type as TEvents["type"]];
    if (!list)
    {
      return;
    }
    for (const handler of list)
    {
      (handler as any)(event);
    }
  }
} 
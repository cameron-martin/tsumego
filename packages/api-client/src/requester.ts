export type Middleware = (next: Handler) => Handler;

export type Handler = (request: Request) => Promise<Response>;

const initialHandler: Handler = (request) => fetch(request);

export class Requester {
  private readonly handler = this.middleware.reduce(
    (handler, middleware) => middleware(handler),
    initialHandler,
  );
  constructor(
    private readonly host: string,
    private readonly middleware: Middleware[],
  ) {}

  async request<Result>(
    method: 'POST' | 'GET',
    path: string,
    body?: unknown,
  ): Promise<Result> {
    const request = new Request(this.host + path, {
      method,
      body: body && JSON.stringify(body),
      headers: body && {
        'Content-Type': 'application/json',
      },
    });

    const response = await this.handler(request);

    if (!response.ok) {
      throw new Error(`Got bad status code: ${response.status}`);
    }

    return response.json() as Promise<Result>;
  }
}

import type { Result } from '@/core/result/result';


export interface IUseCase<
  TPayload extends object = any,
  TResultResponse extends object = any,
  TFailure extends { error: Error } = any,
> {
  execute(payload: TPayload): Promise<Result<TResultResponse, TFailure>>;
}

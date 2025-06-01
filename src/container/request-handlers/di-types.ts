export const REQUEST_HANDLERS_DI_TYPES = {
  LoginRequestHandler: Symbol.for('LoginRequestHandler'),
  AuthenticatedRequestHandler: Symbol.for('AuthenticatedRequestHandler'),
  CreateUserRequestHandler: Symbol.for('CreateUserRequestHandler'),
  CreatePollRequestHandler: Symbol.for('CreatePollRequestHandler'),
  GetPollRequestHandler: Symbol.for('GetPollRequestHandler'),

  HealthRequestHandler: Symbol.for('HealthRequestHandler'),
  VoteOnPollRequestHandler: Symbol.for('VoteOnPollRequestHandler'),
  SkipOnPollRequestHandler: Symbol.for('SkipOnPollRequestHandler'),
  StatsPollRequestHandler: Symbol.for('StatsPollRequestHandler'),
};

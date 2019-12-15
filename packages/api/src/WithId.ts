export const withId = <T>(id: number, entity: T): WithId<T> => ({
  id,
  entity,
});

export interface WithId<T> {
  id: number;
  entity: T;
}

export type Nullable<T> = T | null | undefined

export type ObjectOrArray =
	| { [key: string]: unknown }
	| { [key: string]: unknown }[]

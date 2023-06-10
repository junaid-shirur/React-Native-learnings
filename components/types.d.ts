type FormState = {
  isSubmitting: boolean
  error: boolean
  asteroidId: string
}
type Asteroid = {
  id: string
  name: string
  is_potentially_hazardous_asteroid: string
  close_approach_date: string
  miss_distance_km: string
}

type RootStackParamList = {
  Home: undefined
  Asteroid: Asteroid | undefined
}

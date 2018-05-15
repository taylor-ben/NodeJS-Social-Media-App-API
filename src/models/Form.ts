export interface RegisterInput {
  name?: string;
  email?: string;
  password?: string;
  password2?: string;
}

export interface Input {
  name?: string;
  email?: string;
  password?: string;
  password2?: string;
}

export interface ExperienceInput  {
  title?: string;
  description?: string;
  from?: string;
  to?: string;
  current?: boolean;
  countriesVisited?: string;
}

export interface PostForm {
  text?: string;
}

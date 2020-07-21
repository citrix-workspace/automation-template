import  { Page } from "playwright";
export type Login = {
  page: Page;
  url: string;
  username: string;
  password: string;
  idp: string;
};

export type SkipTour = {
  page: Page;
};

export type GoToActions = {
  page: Page;
};

export type StartAction = {
  page: Page;
  actionName: string;
};

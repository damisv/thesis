export interface MyError {
  title: string;
  message: string;
}
export class Error {
  public title: string;
  public message: string;
  constructor(err: MyError = {title: 'Error Occurred', message: 'Please try again later or contact us.'}) {
    this.title = err.title;
    this.message = err.message;
  }
}

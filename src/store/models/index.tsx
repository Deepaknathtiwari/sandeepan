const { observable, computed } = require('mobx');
const { persist } = require('mobx-persist');

export class userDataModal {
    @persist @observable user_id: string = '';
    @persist @observable lecture_id: string = '';
    @persist @observable questions_count: string = '';
    @persist @observable username: string = '';
    @persist @observable mobile_no: string = '';
    @persist @observable token: string ='';
  }
  
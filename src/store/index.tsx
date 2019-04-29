import { create } from 'mobx-persist';
import { AsyncStorage } from 'react-native';
const hydrate = create({ storage: AsyncStorage });

import userStore from "./userStore";
const stores = {
    userStore : userStore,
   
}

//hydrate stores here with mobx-persist
hydrate('UserStore', userStore);

export default {
    ...stores
};

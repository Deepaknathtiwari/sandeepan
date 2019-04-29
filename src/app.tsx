import { Navigation,  } from "react-native-navigation";
import { registerScreens } from "./screen";
import Utils from "./utils";
import Provider from './store/mobxCustomProvider';
import Stores from "./store";
registerScreens(Stores, Provider);
Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: Utils.Screen.splash
            }
          },
        ],
        options: {
          topBar: {
            visible: false,
            drawBehind: true
          },
          layout: {
            orientation: ["portrait"]
          }
        }
      }
    },
  });
});
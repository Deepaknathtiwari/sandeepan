import { Navigation } from "react-native-navigation";
import Splash from "./splash";
import Login from "./login";
import Utils from "../utils";
import Welcome from "./welcome";
import Question from "./question";

//import { ApolloProvider } from "react-apollo";

// const withProvider = (Component: any) => {
//     return class extends React.Component {
//       render () {
//         return (
//           <ApolloProvider client={Utils.client}>
//             <Component {...this.props} />
//           </ApolloProvider>
//         )
//       }
//     }
// }

export function registerScreens(Stores: any, Provider: any) {
    Navigation.registerComponentWithRedux(Utils.Screen.splash, () => Splash,Provider,Stores);
    Navigation.registerComponentWithRedux(Utils.Screen.login, () => Login,Provider,Stores);
    Navigation.registerComponentWithRedux(Utils.Screen.welcome, () => Welcome,Provider,Stores);
    Navigation.registerComponentWithRedux(Utils.Screen.question, () => Question,Provider,Stores);
    //Navigation.registerComponent(Utils.Screen.animationExample, () => AnimationExample);
    
}
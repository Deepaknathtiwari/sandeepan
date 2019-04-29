import { Navigation } from "react-native-navigation";
//@ts-ignore
import { debounce } from 'lodash';

const handlePush = (componentId: string, screenName: string, passedProps: object = {}) => {
    Navigation.push(componentId, {
        component: {
            name: screenName,
            options: {
                topBar: {
                    visible: false,
                    drawBehind: true
                },
                bottomTabs: {
                    visible: false,
                    drawBehind: true
                },
                layout: {
                    orientation: ["portrait"],
                },
            },
            passProps: passedProps
        }
    })
}

/**
 * Global push type navigation function 
 * @param componentId 
 * @param screenName 
 */
export const handleNavigationPush = debounce(handlePush, 300, { leading: true, trailing: false })

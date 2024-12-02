import {
    // extendTheme,
    // baseTheme,
    // withDefaultColorScheme,
    // createMultiStyleConfigHelpers,
} from "@chakra-ui/react";
import { ChakraProvider, defineStyle } from "@chakra-ui/react";

import { createSystem, defaultConfig } from "@chakra-ui/react"
// import { checkboxAnatomy } from "@chakra-ui/anatomy";

// const { definePartsStyle, defineMultiStyleConfig } =
//     createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const activeLabelStyles = {
    transform: "scale(0.80) translateY(-20px)",
    opacity: 0.75,
};

// const checkBoxBaseStyle = definePartsStyle({
//     label: defineStyle({
//         paddingX: 5,
//         marginLeft: 3,
//     }),
//     control: defineStyle({
//         padding: 2,
//         rounded: "full",
//     }),
//     container: defineStyle({
//         _hover: {
//             borderColor: "brand.500",
//         },
//     }),
// });



// const checkboxTheme = defineMultiStyleConfig({ baseStyle: checkBoxBaseStyle });

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
            // brand: baseTheme.colors.cyan,
        },
        components: {
            // Checkbox: checkboxTheme,
            Alert: {
                defaultProps: {
                    colorScheme: "blue",
                },
            },
            Form: {
                variants: {
                    floating: {
                        container: {
                            _focusWithin: {
                                label: {
                                    ...activeLabelStyles,
                                },
                            },
                            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
                                {
                                    ...activeLabelStyles,
                                },
                            label: {
                                top: 0,
                                left: 0,
                                zIndex: 2,
                                position: "absolute",
                                pointerEvents: "none",
                                my: 1,
                                transformOrigin: "left top",
                            },
                        },
                    },
                },
            },
        },
        // withDefaultColorScheme({ colorScheme: "brand" })
    },
  },
})
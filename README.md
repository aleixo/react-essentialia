# Usage

```
<Provider
        initialLang="PT"
        sizes={{
          XL: 30,
          L: 26,
          M: 22,
          S: 20,
          XS: 18,
          XXS: 16,
          label: 14,
          paragraph: 12,
        }}
        colors={{
          default: {
            text: 'blue',
            border: 'red',
            backgroundColor: 'yellow',
          },
          light: {
            text: 'grey',
            border: 'blue',
          },
        }}
        modifiers={(currentColor) => ({
          button_red: {
            color: 'red',
          },
        })}
        strings={{
          PT: {
            MY_COMPONENT: {
              CURR_LANGUAGE: 'PORTUGUESE',
            },
          },
          EN: {
            MY_COMPONENT: {
              CURR_LANGUAGE: 'ENGLISH',
            },
          },
        }}>
        {children}
      </Provider>
```

# Peer Dependencies

- "react-native-render-html": "^4.2.2",
- "react-native-webview": "^10.4.0"

# Assumptions

All props on the component itselft are there because they depend on the context. All the other props that do not depend on context and relate to
the element and only the element are set on the modifiers object on provider. The modifiers object exists to attach one new style to theme system.

# Roadmap

- [x] Support i18n (multiple language, change language, arguments to i18n strings)
- [x] Support themes (Change theme name, change font scale)
- [x] Component must have variants
- [x] Allow to dispatch only from inner hooks
- [x] Must allow to add new themes to the lib provider and used with components
- [x] Storybook or sample app
- [ ] Add Cell component and several variants
- [x] Change name to react-native-essentialia
- [ ] Manage forms
- [ ] Clean unused code
- [ ] Code must be easily maintanable
- [ ] Add Docs
- [ ] Add support to i18n args to strings
- [ ] Stylesheet performance
- [ ] Use memo in components
- [ ] Add most common components (Check other libs)

# Usage

```
<Provider
        initialLang="PT"
        colors={{
          default: {
            text: 'blue',
          },
          light: {
            text: 'grey',
          },
        }}
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

# Roadmap

- [x] Support i18n (multiple language, change language, arguments to i18n strings)
- [x] Support themes (Change theme name, change font scale)
- [ ] Component must have variants
- [ ] Must allow to add new themes to the lib provider and used with components
- [ ] Code must be easily maintanable with the proper layers
- [ ] Add Cell component and several variants
- [ ] Change name to react-native-essentialia
- [ ] Allow to dispatch only from inner hooks
- [ ] Manage forms
- [ ] Add Docs
- [ ] Storybook or sample app
- [ ] Add support to i18n args to strings
- [ ] Allow to add component variants in entry point
- [ ] Stylesheet performance
- [ ] Use memo in components
- [ ] Add most common components (Check other libs)

# Usage

## Provider configuration

Configure the lib at app entry. The lib after configured will provide to you the theme, i18n and all the styles needed.

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

## Usage

### Hooks

The lib provide one hook to:

- Change font scale
- Change font theme
- Change language

```
import {  useDispatcher  } from 'react-native-essentialia';

...

const dispatcher = useDispatcher();

...

// Change language
dispatcher.i18n({ newLanguage: 'EN' });
// Change font scale
dispatcher.theme({ fontScale: 2 });
// Change theme
dispatcher.theme({ theme: 'light' });

```

The dispatcher will not re-render the caller component.

Also, all those functionalities are available on `<Button />` as props.

### View

View with default shadow

```
<View m={20} p={20} shadow>
        <Text h1>TEXT</Text>
      </View>
```

### Text

The text will read the provided configurations on the Provider by the sizes object

```
<Text h1>H1</Text>
<Text h3>H2</Text>
<Text h3>H3</Text>
<Text h4>H4</Text>
<Text h5>H5</Text>
<Text h5>H6</Text>
<Text paragraph>P</Text>
<Text label>L</Text>
```

Also the text will react to i18n if you give the corresponding string

```
<Text h5>MY_COMPONENT.CURR_LANGUAGE</Text>
```

You can also concatenate with ordinary string since it lib will check if it should or not be internacionalized.
if not will return the raw children

The following example will display "Paragraph PORTUGUESE" assuming the configuration in the top of
the example

```
<Text paragraph>Paragraph MY_COMPONENT.CURR_LANGUAGE</Text>
```

### Button

We have some default modifiers:

- round
- bordered

Using one default modifier:

```
<Button modifiers="round" size={100} title="Test modifiers" />
```

Using a custom modifier (button_red) provided in the Provider

```
<Button
          modifiers="round button_red"
          size={100}
          title="Test custom modifiers"
        />
```

Change the language on press in the order specified on `langToggle`

```
<Button langToggle={['EN', 'PT']} title="Change to english AUTO" />
```

Auto scale font on press with the following example. Will change to the order specified on
`fontScaleToggle`

```
<Button fontScaleToggle={[2, 1, 0.5]} title="Scale font AUTO" />
```

Use toggling theme in button. This will toggle between `light` and `default` themes in the order provided on `themeToggle`

```
<Button themeToggle={['light', 'default']} title="Theme toggle AUTO" />
```

### Forms

Components that can be used inside a form

- text
- button
- TextInput

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
- [x] Change name to react-native-essentialia
- [ ] Add Cell component and several variants
- [ ] Manage forms
- [ ] Clean unused code
- [ ] Code must be easily maintanable
- [ ] Add Docs
- [ ] Add support to i18n args to strings
- [ ] Stylesheet performance
- [ ] Use memo in components
- [ ] Add most common components (Check other libs)
- [ ] Allow button to show things on click internally (popup, fullscreen image etc)

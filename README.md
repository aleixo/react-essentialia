# Lib goals

This lib takes into account the following elements
`view, button, h1, h2, paragraph, label, tabs`

## Available templates

- round
- border
- underlined
- link
- shadow

### Separated by component

- View
  - round - A round view
  - border - View with border
  - shadow - View with shadow
- button

  - round - round button
  - border - button with border (DEFAULT)
  - shadow - button with shadown
  - link - button with only text
  - underlined - button with text underlined

- Extensible to other projects

  - Types of elements
    - Button - round badge border underlined link
  - Allow to set text sizes
  - Allow to set default values. Each prop can have element name behind to customize the element itself. If element prop is given it will override the global one. the keys be readed with insensitive case to prevent errors

  ```
  {
    borderRadius: 1,
    buttonborderRadius: 1,
    h1color: 'red',
    shadowRadius: 5,
  }
  ```

  - Allow to set colors

  ```
  {
    primary: '#FFFFFF',
    background: '#FFFFFF',
    borders: '#FFFFFF',
    shadows
    text: '#FFFFFF',
  }
  ```

  - Allow to set text configurations

  ```
  {
    H1: 30,
    H2, 20
    ...
    H6: 10
    paragraph: 4
    label: 2,
    fontFamily: Sans-serif
  }
  ```

- Easy to use and costumize

  - The lib can be used out of the box with defaults that can be easily overriten
  - The lib defauls must be applied to the global lib or to the component
  - Must be able to add styles to the default behaviour in two forms
    - Add them overriding configuration keys
    - Giving to the lib one style object and use if when we want
  - Very clear API that must be conformant with the best practices

- Performance
  - The lib must be able to be aware of all the Stylesheets and create RN stylesheets. After, the lib should try to optimize stylesheet creationg double checking if for one stylesheet another equal has been already created

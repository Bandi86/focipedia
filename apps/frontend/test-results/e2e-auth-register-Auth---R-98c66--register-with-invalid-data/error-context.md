# Page snapshot

```yaml
- banner:
  - link "Focipedia":
    - /url: /
  - navigation "Fő navigáció":
    - link "Bejelentkezés":
      - /url: /login
    - link "Regisztráció":
      - /url: /register
- heading "Regisztráció" [level=1]
- paragraph: Hozz létre egy fiókot az alábbi űrlappal.
- text: Név (opcionális)
- textbox "Név (opcionális)"
- text: E-mail
- textbox "E-mail": bad-email
- text: Érvénytelen e-mail formátum Jelszó
- textbox "Jelszó": "123"
- text: Jelszó megerősítése
- textbox "Jelszó megerősítése"
- button "Regisztráció"
- text: Van fiókod?
- link "Bejelentkezés":
  - /url: /login
- region "Notifications alt+T"
- alert
```
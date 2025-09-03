![Validate JSONs](https://github.com/tjurczyk/arkadia-data/workflows/Validate%20JSONs/badge.svg)

Dane wspierające skrypty - https://github.com/tjurczyk/arkadia

## Przeglądarka wiedzy

Repozytorium zawiera niewielką przeglądarkę React + Bootstrap dla zbiorów `knowledge_data.json`, `herbs_data.json`, `magics_data.json` oraz `magic_keys.json`, umieszczoną w katalogu `data-browser/`.
Została zbudowana przy użyciu [Vite](https://vitejs.dev/) oraz TypeScriptu i korzysta z ciemnego motywu Bootstrapa.
Pozwala wyszukiwać książki, biblioteki, zioła, czary i klucze według kategorii.
Uruchom `cd data-browser && yarn && yarn build`, aby wygenerować statyczną stronę w katalogu `data-browser/docs/`.
Po włączeniu GitHub Pages przeglądarka będzie dostępna pod adresem
`https://<twoja-nazwa-uzytkownika>.github.io/arkadia-data/`.

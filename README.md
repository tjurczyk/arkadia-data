![Validate JSONs](https://github.com/tjurczyk/arkadia-data/workflows/Validate%20JSONs/badge.svg)

Dane wspierające skrypty - https://github.com/tjurczyk/arkadia

## Przeglądarka danych

Repozytorium zawiera niewielką przeglądarkę React + Bootstrap dla zbiorów `knowledge_data.json`, `magics_data.json`, `magic_keys.json` oraz `herbs_data.json`, umieszczoną w katalogu `data-browser/`.
Została zbudowana przy użyciu [Vite](https://vitejs.dev/) oraz TypeScriptu i korzysta z ciemnego motywu Bootstrapa.
U góry strony znajdują się przyciski pozwalające przełączać się między widokami wiedzy, magii, kluczy i ziół.
Wiedzę filtruje się według kategorii, czary i klucze można wyszukiwać prostym tekstem, a zioła filtrować po efektach.
Uruchom `cd data-browser && yarn && yarn build`, aby wygenerować statyczną stronę w katalogu `data-browser/docs/`.
Po włączeniu GitHub Pages przeglądarka będzie dostępna pod adresem
`https://<twoja-nazwa-uzytkownika>.github.io/arkadia-data/`.

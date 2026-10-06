# Updating the IAK Solutions website

This is a static site. There is no built-in visual editor or WordPress login.

## Where to edit

| File | Content |
| --- | --- |
| `public/index.html` | Home page |
| `public/about.html` | About the company |
| `public/services.html` | All ten service descriptions |
| `public/projects.html` | Selected project summaries |
| `public/contact.html` | Phone number and contact guidance |
| `public/style.css` | Shared visual styling |
| `public/assets/` | Logo, image, favicon and navigation script |

## Text changes

Edit the text between HTML tags, preserving the tags, classes and IDs. For example, change the words in `<p>Your text here</p>` while keeping `<p>` and `</p>` intact. The website's header and footer appear in every HTML page; changes to shared contact details must be made on every page, including `404.html`.

## Phone changes

The current number is `+92 (316) 514 7531`. Replace its display text and the corresponding `tel:+923165147531` links wherever they appear. Keep the international dialling code in telephone links.

## Image changes

Replace `public/assets/building.jpg` with an approved image, or change the homepage image URL and its `alt` description together. Replace `public/assets/logo.png` to update the logo. Use the current filenames to avoid broken links unless you also update the HTML references.

## Publishing updates

Preview and run the checks, commit the changes to the linked Git repository, then review the Vercel deployment. Keep the previous revision available so an accidental change can be reverted. If the client is uncomfortable editing HTML, add a visual CMS before treating this as a self-service handover.

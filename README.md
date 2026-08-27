# Vitesse Semi Estival

## Sujet

Jean-Michel est patron d’une petite guinguette sur la plage de Audinghen. Cet été, la demande de churros et autre snack balnéaire a explosé suite à une arrivée massive de nouveaux touristes.

Pour pallier à cette demande trop forte, il a employé du personnel qui parcourt les plages de sable gris à la recherche de nouveaux clients.

Seulement, ceux-ci se plaignent. Ils doivent calculer tous les prix de tête et perdent un temps fou à organiser leur panier de vente, qu’ils emmènent avec eux sur la plage.

Jean-Michel vous contacte pour créer une application web qui permettrait à ses employés de calculer automatiquement le prix de chaque panier, mais aussi de consulter quel produit s’est le plus vendu.

## Exercice

Cet exercice est à faire en binôme.

### Question 1

Faites la liste des différentes tâches qui vous permettront de mener à bien votre mission.

Jean-Michel n’est pas vraiment ce qu’on appel un client arrangeant. Il ne connait rien au développement, mais veut pouvoir consulter l’état d’avancement du projet à tout moment.

Pour ce faire, veillez à maintenir à jour la liste de tâche effectuée et à bien communiquer entre vous.

L’utilisation avancé de git peut également être un bon point.

---

Rappel :

```bash
git init -> initialiser le repository git
git remote add origin <...> -> relier un repository local à un repository distant
```

## BDD

### Question 2

Jean-Michel vous présente Saturnin, son petit-fils, qui avait déjà un petit peu réfléchi à la question, et qui vous explique ce qu’il a saisi du problème.

Il vend plusieurs **produits** (churros, gaufres, boissons...), chacun ayant un nom, un prix, et une petite description qu'il affiche sur son ardoise.

Chaque jour, ses vendeurs enregistrent des **ventes** sur la plage. Un client achète rarement un seul article : une vente peut donc regrouper **plusieurs produits**, en quantités variables. Chaque vente est associée à la date à laquelle elle a eu lieu, ainsi qu'au vendeur qui l'a réalisée.

Saturnin vous a dors et déjà créé un script sql qui met en place les données d’une semaine précédente.

Mettez en place une base de données Postgresql via docker.

Complétez le fichier `docker-compose.yml` qui initialise la base selon les paramètres suivants :

- POSTGRES_USER: user
- POSTGRES_PASSWORD: guinguette
- POSTGRES_DB: estival
- ports: "5432:5432"

Une fois cette étape terminée, vous aurez mis en place cette partie du modèle 3-tier :

```text
BDD <-- SQL :5432 -->
```

## Back - Express

### Question 3

L’architecture de la partie back a été préparé en avance.

Dans `server.js`, mettez en place la base d’une application ExpressJS. Vous écouterez le port 3000.

Vous utiliserez le script `dev` pour développer et lancer votre application.

Une fois cette étape terminée, vous aurez mis en place cette partie du modèle 3-tier :

```text
Backend <-- REST :3000 -->
```

Reliez maintenant votre base de données à votre backend.

Complétez le fichier `.env` avec les données suivantes :

```text
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
PORT=
```

Dans db.js, préparez ensuite la connexion à la base de données via les identifiants notées dans le fichier précédent.

```jsx
import "dotenv/config";

process.env.<variable>
```

Désormais, votre modèle 3-tier doit être :

```text
BDD <-- SQL :5432 --> Backend <-- REST :3000 -->
```

### Question 4

Nous allons maintenant mettre en place les différentes routes nécessaires à la communication des données de la base à un client.

Dans le fichier `router.js`, préparez l’ensemble des routes qui vont servir à répondre aux demandes du client.

```jsx
const router = express.Router();
```

Avant d’attaquer l’écriture des routes, n’oubliez de dire au server de rediriger l’ensemble des requêtes vers le router.

Développez maintenant les routes nécessaires au bon fonctionnement de l’application :

- Vérifie qu’un code vendeur existe
- Liste les produits
- Insère une nouvelle vente (Attention, plusieurs requêtes à la base peuvent être nécessaire)

```jsx
router.<...>('<...>', (req, res) => {

    res.json({
        "status": "OK"
    });
});

```

Vous pouvez générer la date et l’heure de la façon suivante :

```jsx
const now = new Date();
const dateJour = now.toISOString().slice(0, 10);
const heure = now.toTimeString().slice(0, 8);
```

Vous pourrez tester vos routes avec les chemins suivants :

- <http://localhost:3000/>
- <http://localhost:3000/vendeur?code=V001>
- <http://localhost:3000/produits>
- <http://localhost:3000/vente>
  - le body :
```json
{
    "vendeurId": 1,
    "lignes": [
    { "produitId": 1, "quantite": 2 },
    { "produitId": 3, "quantite": 1 }
    ]
}
```

## React

### Question 5

Utilisez le projet React fourni. Vous allez mettre en place une interface qui permet :

- de saisir un code vendeur et de se connecter
- de saisir un panier via les produits, puis d’effectuer la vente

Mettez en place l’interface en dur dans un premier temps.

Votre modèle 3-tier sera alors :

```text
Frontend <-- :5173 --> Utilisateur final
```

### Question 6

Dans la partie vente, préparez les boutons qui serviront au vendeur pour sélectionner les choix des clients.

N’hésitez pas à utiliser des valeurs tests pour développer :

```json
const produitsExemple = [
    { id: 1, nom: "Churros", prix: 3.50 },
    { id: 2, nom: "Gaufre", prix: 4.00 },
];

// dans le JSX :
{produitsExemple.map(p => (
    <button key={p.id}>...</button>
))}
```

Vous préparerez ensuite 3 fonctions :

- `connexionVente` : qui vérifiera la véracité du code vendeur et récupèrera l’id du vendeur
- `ajouterProduit` : qui met les produits choisi dans le panier
- `validerVente` : qui envoie la liste des produits choisi au backend

### Question 7

Il est temps d’aller interroger le backend pour mettre en place nos différentes fonctionnalités.

Dans un premier temps, travaillez sur la fonction `connexionVente()`.

Vous effectuerez d’abord une requête qui vérifiera la véracité du code vendeur.

Exemple :

```jsx
const res = await fetch(`http://localhost:3000/vendeur?code=${vendeurCode}`)
const data = await res.json();
```

Récupérez les données du vendeur, puis passez sur la vue vente. Vous effectuerez ensuite une nouvelle requête au backend afin de récupérer la liste des produits disponibles.

Votre modèle 3-tier sera alors :

```text
Backend <-- REST :3000 --> Frontend <-- :5173 --> Utilisateur final
```

### Question 8

Mettez en place les ventes.

Pour ce faire, rassembler les données des produits vendu, puis envoyez la bonne requête au backend.

Exemple :

```jsx
const lignes = produitsVendu.map(p => ({ produitId: p.id, quantite: 1 }));

const res = await fetch("...", {
    method: "...",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(...),
});
```

## Final

### Question 9

Réglez les derniers bugs et autres incohérences d’appel entre le front et le back.

Si tout s’est bien passé, votre modèle 3-tier devrait maintenant être :

```text
BDD <-- SQL :5432 --> Backend <-- REST :3000 --> Frontend <-- :5173 --> Utilisateur final
```

Félicitation ! Vous avez réussi à suivre le cahier des charges de Jean-Michel !
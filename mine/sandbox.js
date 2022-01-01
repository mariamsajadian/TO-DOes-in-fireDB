// second show in the dom

const list = document.querySelector('ul');
const form = document.querySelector('form');
const button = document.querySelector('button');


const addRecipe = (recipe, id) => {
    // console.log(recipe.create_at.toDate());
    let time = (recipe.create_at.toDate());
    let html = `
    <li data-id="${id}"><div>${recipe.title}</div>
    <div>${time}</div>
    <button class="btn btn-danger btn-sm my-2">delete</button></li>
    `;

    // console.log(html);
list.innerHTML += html;
}

//delete realtime from DOM not database
const deleteRecipe = (id) =>{
    const recipes = document.querySelectorAll('li');
    recipes.forEach(recipe => {
        if(recipe.getAttribute('data-id') === id){
            recipe.remove();
        }
        
    });
};



// get realTime Data 
const unsub = db.collection('recepies').onSnapshot(snapshot => {
    // console.log(snapshot.docChanges());// this shows that document added or removed
    snapshot.docChanges().forEach(change => {
        const doc = change.doc;
        // console.log(doc);
        if(change.type === 'added'){
            addRecipe(doc.data(), doc.id);
        } else if(change.type === 'removed'){
            deleteRecipe(doc.id);
            console.log("recipe is deleted from DOM")

        }
    })

});


// // this is one that run one time not real time
// //first step getting data from DB and Data from promise this is not good for real time updating
// db.collection('recepies').get().then((s)=>{
//     // console.log(s.docs[0].data());
//     s.docs.forEach(doc => {
//         // console.log(doc.id);
//         addRecipe(doc.data(), doc.id);
//         // console.log(doc.data());
//     });
// }).catch((err)=>{
//     console.log(err);
// }); // in firedatabase and get is for getting data from db.

// add recipe to database
form.addEventListener('submit',e=>{
    e.preventDefault();
    const now = new Date();
    const recepies = {
        title: form.recipe.value, // recipe is the id of input
        create_at: firebase.firestore.Timestamp.fromDate(now),// this line base on firebase library that is added in html file   <script src="https://www.gstatic.com/firebasejs/5.8.4/firebase-firestore.js"></script>
        

    };
    db.collection('recepies').add(recepies).then(() =>{
        console.log('recipe is added.');
    }).catch(err=>{ console.log(err)
    });
    // console.log()

});

//deletting data from recipies collection in database
list.addEventListener('click', e =>{
    console.log(e);
    if(e.target.tagName === 'BUTTON'){
        const id = e.target.parentElement.getAttribute('data-id');// we want to access parent element to delete , so we set id to access that through data-id that returns in doc.id
        console.log(id);
        db.collection('recepies').doc(id).delete().then(() => {
            console.log('recipe deleted from DB');
          });
    }
});

// unsubscript
button.addEventListener('click', e =>{
    unsub();
    console.log('unsubscribed');


});


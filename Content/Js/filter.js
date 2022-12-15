var Filter = {
  Apis: {
      categories: "https://dummyjson.com/products/categories",
      product:"https://dummyjson.com/products/search?q=phone",
  },
  Elements: {
      categoryList: document.getElementById("category-list"),
      productList: document.getElementById("product-list"),
      cardTemp: document.getElementById("card-temp"),
      categoryTemp: document.getElementById("category-list-item-temp"),
      clearButton: document.getElementById("clear-button"),
      //ürünler için arama 
      searchInput: document.getElementById("search-input"),
      searchInputCtg: document.getElementById("search-input-ctg"),
  },
  Status: {
      categories: [],
      query: "",
      selectedCtg: "",
      sort: "",
      products: []
  },
  Actions: {
      //Sayfa ilk açıldığında istenilen fonksiyonları çalıştrıacak
      init: () => {
          Filter.Actions.getAllCategories(); //  get all categories
          Filter.Actions.getAllProducts();
      },
      //kategori listesini html'e ekliyor
      appendCategoriesToHtml: () => {
          Filter.Elements.categoryList.innerHTML = "";

          for (let i = 0; i < Filter.Status.categories.length; i++) {
              const ctg = Filter.Status.categories[i];
              var div = document.createElement("div");
              div.innerHTML = Filter.Elements.categoryTemp.innerHTML;
              //div.querySelector("input").id = ctg;
              div.querySelector("input").setAttribute("id", ctg);
              div.querySelector("label").setAttribute("for", ctg);

              var text = ctg.replaceAll("-", " ");
              var firstChar = text.charAt(0).toLocaleUpperCase();
              text = firstChar + text.substring(1);

              div.querySelector("label").innerText = text;
              Filter.Elements.categoryList.appendChild(div.querySelector("li"));
          }
      },
      appendProductsToHtml: () => {
        Filter.Elements.productList.innerHTML = "";

          for (let i = 0; i < Filter.Status.products.length; i++) {
              const prd = Filter.Status.products[i];
              var div = document.createElement("div");
              div.innerHTML = Filter.Elements.cardTemp.innerHTML;
              div.querySelector("h5").innerText = prd.title;
              div.querySelector("p").innerText = prd.description;
              div.querySelector("img").setAttribute("src", prd.images[0]);
              Filter.Elements.productList.appendChild(div.querySelector("a"))
          }
      },
      entrySearch: function(){
        var el= Filter.Elements;
        Filter.Status.query=el.searchInput.value;
        Filter.Actions.entryFilter();
      },
      entryGrSearch: function(){
        var el=Filter.Elements;
        Filter.Status.selectedCtg=el.searchInputCtg.value;
        Filter.Actions.entryGrFilter();
      },
      entryFilter: function(){
        var el=Filter.Elements;
        var filter=Filter.Status;
        var filtered=Filter.Status.products;
        if(filter.query.length>0){
          var val = filter.query.toLocaleLowerCase();
          function cullender(data){
           return data.title.toLocaleLowerCase().includes(val) || data.description.toLocaleLowerCase().includes(val)
          }
          filtered=filtered.filter(cullender);
        }
        el.productList.innerHTML="";
        if(filtered.length>0){
          Filter.Elements.clearButton.style.display = "inline";
          for(let i=0; i<filtered.length; i++){
              const ard = filtered[i];
              var div = document.createElement("div");
              div.innerHTML = el.cardTemp.innerHTML;
              div.querySelector("h5").innerText = ard.title;
              div.querySelector("p").innerText = ard.description;
              div.querySelector("img").setAttribute("src", ard.images[0]);
              Filter.Elements.productList.appendChild(div.querySelector("a"))
          }
        }else{
          el.productList.innerText="Sonuç bulunamadı"
        }
      },
      entryGrFilter: function(){
        var el= Filter.Elements;
        var filter= Filter.Status.selectedCtg;
        var filtered=Filter.Status.categories;
        if(filter.length>0){
          var val =filter.toLocaleLowerCase();
          function cullenderG(data){
            return data.toLocaleLowerCase().includes(val)
          }
          filtered=filtered.filter(cullenderG);
        }
        el.categoryList.innerHTML="";
        if(filtered.length>0){
          Filter.Elements.clearButton.style.display = "inline";
          for(let i=0; i<filtered.length; i++){
            const ctg=filtered[i];
            var div=document.createElement("div");
            div.innerHTML=el.categoryTemp.innerHTML;
            div.querySelector("input").setAttribute("id", ctg);
            div.querySelector("label").setAttribute("for", ctg);
            var text = ctg.replaceAll("-", " ");
            var firstChar = text.charAt(0).toLocaleUpperCase();
            text = firstChar + text.substring(1);
            div.querySelector("label").innerText = text;
            Filter.Elements.categoryList.appendChild(div.querySelector("li"));
          }
        }
        else{
          el.categoryList.innerText="Sonuç bulunamadı!"
        }
      },
      //api'den tüm kategori listesini getiriyor
      getAllCategories: () => {
          fetch(Filter.Apis.categories)
              .then(res => res.json())
              .then(res => {
                Filter.Status.categories = res;
                Filter.Actions.appendCategoriesToHtml();
              });
      },
      getAllProducts: () => {
        fetch(Filter.Apis.product)
            .then(res => res.json())
            .then(res => {
                Filter.Status.products = res.products;
                Filter.Actions.appendProductsToHtml();
            });
    },
      //var olan filtreleri temizleyecez
      clear: () => {
        Filter.Elements.searchInput.value=""
        window.location.reload()
      },
  },
};
Filter.Actions.init();
var taxasArtigos = {
       taxs: [],
        loadArticleTax({article_id}) {
              return new Promise((resolve, reject) =>{
                  $.ajax({
                      url: "/api/imposto/artigo",
                      method: "POST",
                      contentType: "application/json",
                      data: JSON.stringify({arg_artigo_id: article_id, is_admin: location.href.includes("admin")}),
                      success(data) {
                          resolve(data);
                      },
                      error(error){
                          reject(error);
                      }
                  });
              });
       },
       addTax(data, article_id){
          taxasArtigos.taxs.push({
                                 artigo_id: article_id,
                                 percentagem_adicionar: data.percentagem_adicionar,
                                 percentagem_retirar: data.percentagem_retirar,
                                 taxa_adicionar: data.taxa_adicionar,
                                 taxa_retirar: data.taxa_retirar,
                                 impostos:  data.taxas
                             });
       },
      getImpostos(artigo_id){
           let taxa  = taxasArtigos.taxs.find(value => value.artigo_id === artigo_id);
           return taxa ? taxa.impostos : [];
      },
       showTax(article_id){
           let hasTax = false;
          let tax = taxasArtigos.taxs.find(value => value.artigo_id === article_id);
          if(tax){
              if(Number(tax.percentagem_adicionar) > 0){
                  hasTax = true;
                  return {valor: tax.percentagem_adicionar+"%", tipo: "add"};
              }
              if(Number(tax.percentagem_retirar) > 0){
                  hasTax = true;
                  return {valor: tax.percentagem_retirar+"%", tipo: "remove"};
              }
              if(Number(tax.taxa_adicionar) > 0){
                  hasTax = true;
                  return {valor: tax.taxa_adicionar.dc().formatter()+" STN", tipo: "add"};
              }
              if(Number(tax.taxa_retirar) > 0){
                  hasTax = true;
                  return {valor: tax.taxa_retirar.dc().formatter()+" STN", tipo: "remove"};
              }
              if(!hasTax) return {valor: null};
          }
          else return {valor: null};
       },
       calculateValues({montanteQuantidade, artigo_id, article_name = "" }){
           let valorImpostoRetirar;
           let valorImpostoRetirado;
           let valorSemImposto = 0;
           let valorImpostoAdicionar;
           let valorImpostoTotalTaxa;
           let valorComImposto = 0;
           let taxa = taxasArtigos.taxs.find(value => value.artigo_id === artigo_id );

           valorImpostoRetirar = ( ( Number(montanteQuantidade) - Number(taxa.taxa_retirar) ) * Number(taxa.percentagem_retirar) ) / ( 100 + Number(taxa.percentagem_retirar));
           valorImpostoRetirar = Number(valorImpostoRetirar) + Number(taxa.taxa_retirar);
           valorSemImposto = Number(montanteQuantidade) - Number(valorImpostoRetirar);

           valorImpostoRetirado = ( Number(valorSemImposto) * ( Number(taxa.percentagem_retirar) / 100.0 ) ) + Number(taxa.taxa_retirar);
           valorImpostoAdicionar =  Number(valorSemImposto) * ( Number(taxa.percentagem_adicionar) /100.0 ) + Number(taxa.taxa_adicionar);
           valorImpostoTotalTaxa = Number(valorImpostoRetirado) + Number(valorImpostoAdicionar);

           valorComImposto = Number(valorSemImposto) + Number(valorImpostoTotalTaxa);
           return {
                subtotal: valorSemImposto,
               total: valorComImposto,
               valor_imposto_retirar: valorImpostoRetirar,
               valor_imposto_adicionar: valorImpostoAdicionar,
               total_taxa: valorImpostoTotalTaxa
           };
       }
}

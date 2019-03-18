import React from 'react';
import 'whatwg-fetch'
import FlatTrackList from './FlatTrackList'
import SearchComponent from './SearchComponent'
import ObjectId from 'objectid-browser';
//let config = require('./config');

export default class JamendoSearch extends SearchComponent {
      search(filter,filterTag,limit) {
        limit=20;
        this.props.startWaiting();
        let that = this;
        
        
      //'https://freemusicarchive.org/api/get/tracks.json?limit=1&track_id=' + song.fma_id + '&api_key=' + freeMusicArchiveApiKey}
     // console.log(['FMA SEARCH'])
      
      
      //

      //&fuzzytags=groove+rock&speed=high+veryhigh&groupby=artist_id
      
         //+"&artist_name="+filter+"&album_name="+filter
         let extra='';
        // console.log(['JS',filterTag]);
        if (filterTag) {
            extra='&fuzzytags='+filterTag;
        }
         
        this.props.fetchData(this.props.apiUrl+"/jamendosearchproxy?limit="+limit+"&filter="+filter+extra)
        .then(function(response) {
          //  console.log(['got response', response])
            return response.json()
        }).then(function(json) {
            let final=[];
           // let promises=[];
            console.log(json);                
            if (json.results) {
              //  console.log(json.results);
                for (let a in json.results) {
                    let song = json.results[a];
                 //   console.log(typeof line,line);
                   //if (typeof line === "string" && line.length > 0) {
                        //let idStart=line.lastIndexOf("(");
                        //let idEnd=line.lastIndexOf(")");
                        //let artistStart=line.indexOf("[");
                        //let artistEnd=line.indexOf("]");
                        //let artist=line.substring(artistStart+1,artistEnd);
                        //let title = line.substring(artistEnd + 1,idStart -1);
                            
                        //let id=line.substring(idStart+1,idEnd);
                        ////console.log(idStart,idEnd,id,artistStart,artistEnd,artist,title);
                        function htmldecode(s){
                            let HTML_ESC_MAP = {
                            "nbsp":" ","iexcl":"¡","cent":"¢","pound":"£","curren":"¤","yen":"¥","brvbar":"¦","sect":"§","uml":"¨","copy":"©","ordf":"ª","laquo":"«","not":"¬","reg":"®","macr":"¯","deg":"°","plusmn":"±","sup2":"²","sup3":"³","acute":"´","micro":"µ","para":"¶","middot":"·","cedil":"¸","sup1":"¹","ordm":"º","raquo":"»","frac14":"¼","frac12":"½","frac34":"¾","iquest":"¿","Agrave":"À","Aacute":"Á","Acirc":"Â","Atilde":"Ã","Auml":"Ä","Aring":"Å","AElig":"Æ","Ccedil":"Ç","Egrave":"È","Eacute":"É","Ecirc":"Ê","Euml":"Ë","Igrave":"Ì","Iacute":"Í","Icirc":"Î","Iuml":"Ï","ETH":"Ð","Ntilde":"Ñ","Ograve":"Ò","Oacute":"Ó","Ocirc":"Ô","Otilde":"Õ","Ouml":"Ö","times":"×","Oslash":"Ø","Ugrave":"Ù","Uacute":"Ú","Ucirc":"Û","Uuml":"Ü","Yacute":"Ý","THORN":"Þ","szlig":"ß","agrave":"à","aacute":"á","acirc":"â","atilde":"ã","auml":"ä","aring":"å","aelig":"æ","ccedil":"ç","egrave":"è","eacute":"é","ecirc":"ê","euml":"ë","igrave":"ì","iacute":"í","icirc":"î","iuml":"ï","eth":"ð","ntilde":"ñ","ograve":"ò","oacute":"ó","ocirc":"ô","otilde":"õ","ouml":"ö","divide":"÷","oslash":"ø","ugrave":"ù","uacute":"ú","ucirc":"û","uuml":"ü","yacute":"ý","thorn":"þ","yuml":"ÿ","fnof":"ƒ","Alpha":"Α","Beta":"Β","Gamma":"Γ","Delta":"Δ","Epsilon":"Ε","Zeta":"Ζ","Eta":"Η","Theta":"Θ","Iota":"Ι","Kappa":"Κ","Lambda":"Λ","Mu":"Μ","Nu":"Ν","Xi":"Ξ","Omicron":"Ο","Pi":"Π","Rho":"Ρ","Sigma":"Σ","Tau":"Τ","Upsilon":"Υ","Phi":"Φ","Chi":"Χ","Psi":"Ψ","Omega":"Ω","alpha":"α","beta":"β","gamma":"γ","delta":"δ","epsilon":"ε","zeta":"ζ","eta":"η","theta":"θ","iota":"ι","kappa":"κ","lambda":"λ","mu":"μ","nu":"ν","xi":"ξ","omicron":"ο","pi":"π","rho":"ρ","sigmaf":"ς","sigma":"σ","tau":"τ","upsilon":"υ","phi":"φ","chi":"χ","psi":"ψ","omega":"ω","thetasym":"ϑ","upsih":"ϒ","piv":"ϖ","bull":"•","hellip":"…","prime":"′","Prime":"″","oline":"‾","frasl":"⁄","weierp":"℘","image":"ℑ","real":"ℜ","trade":"™","alefsym":"ℵ","larr":"←","uarr":"↑","rarr":"→","darr":"↓","harr":"↔","crarr":"↵","lArr":"⇐","uArr":"⇑","rArr":"⇒","dArr":"⇓","hArr":"⇔","forall":"∀","part":"∂","exist":"∃","empty":"∅","nabla":"∇","isin":"∈","notin":"∉","ni":"∋","prod":"∏","sum":"∑","minus":"−","lowast":"∗","radic":"√","prop":"∝","infin":"∞","ang":"∠","and":"∧","or":"∨","cap":"∩","cup":"∪","int":"∫","there4":"∴","sim":"∼","cong":"≅","asymp":"≈","ne":"≠","equiv":"≡","le":"≤","ge":"≥","sub":"⊂","sup":"⊃","nsub":"⊄","sube":"⊆","supe":"⊇","oplus":"⊕","otimes":"⊗","perp":"⊥","sdot":"⋅","lceil":"⌈","rceil":"⌉","lfloor":"⌊","rfloor":"⌋","lang":"〈","rang":"〉","loz":"◊","spades":"♠","clubs":"♣","hearts":"♥","diams":"♦","\"":"quot","amp":"&","lt":"<","gt":">","OElig":"Œ","oelig":"œ","Scaron":"Š","scaron":"š","Yuml":"Ÿ","circ":"ˆ","tilde":"˜","ndash":"–","mdash":"—","lsquo":"‘","rsquo":"’","sbquo":"‚","ldquo":"“","rdquo":"”","bdquo":"„","dagger":"†","Dagger":"‡","permil":"‰","lsaquo":"‹","rsaquo":"›","euro":"€"};
                            //if(!window.HTML_ESC_MAP_EXP)
                                //window.HTML_ESC_MAP_EXP = new RegExp("&("+Object.keys(HTML_ESC_MAP).join("|")+");","g");
                            return s?s.replace(window.HTML_ESC_MAP_EXP,function(x){
                                return HTML_ESC_MAP[x.substring(1,x.length-1)]||x;
                            }):s;
                        }
                        let genres='';
                        if (song.musicinfo && song.musicinfo.tags && song.musicinfo.tags.genres) {
							genres = song.musicinfo.tags.genres.join(",")
						}
                        let record={_id: new ObjectId().toString(),jamendoId: song.id,title:htmldecode(song.name),artist:htmldecode(song.artist_name),url:song.audiodownload,albumart:song.image,genre:genres,expanded: true};
                        console.log(record)
                        final.push(record);    
                   // }
                }
                console.log(final)
                that.props.setSearchResults('jamendo',final);
                that.props.stopWaiting();
                      
            }
            
        }).catch(function(ex) {
            console.log(['song search failed', ex])
        })
        
    };
    
    render() {
        return (
            <div> 
                <h4>Jamendo Search</h4>
                {this.props.searchResults && this.props.searchResults.jamendo && this.props.searchResults.jamendo.length>0 && <FlatTrackList {...this.props}  tagSearchType="jamendo"  items={this.props.searchResults.jamendo}  ></FlatTrackList>}
                
            </div>
        )
    }  
};

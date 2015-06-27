

var tiles = [];
var num_tiles_up = 0;
var num_pares_encontrados;
var numCartas;
var primera;
var segunda;
var semaforo = "verde";



/* ==================================== Memorygame =================================*/
/**
*Constructora
*@gs : servidor grafico
*/
var MemoryGame = function(gs){
	this.gs = gs;
	this.numCartas = 8;
	this.num_pares_encontrados = 0;




/**
*Inicializa el juego añadiendo las cartas, desordenandolas y
*comenzando el bucle del juego.
*/
this.initGame = function(){
this.gs.drawMessage("Memory Game");
//Añadimos cada carta dos veces a nuestro array.
var i = 0;
for (key in this.gs.maps) {
	//Si la key es "back"  no hacemos nada, nos interesa guardar solo los sprites de las demas.
	if (key != "back"){
		//creamos las cartas en estado boca abajo.
		tiles[i] = new MemoryGameCard(key)
		i = i + 1;
		tiles[i] = new MemoryGameCard(key)
		i = i + 1;
	}
   
}
 //Desordenamos el array
 	tiles = tiles.sort(function() {return Math.random() - 0.5});

 //Dibujamos todas las cartas al ejecutar  loop
 this.loop();


};

/**
*Dibuja el juego:
* -Escribe el mensaje con el estado actual.
* -Pide a cada una de las cartas del tablero que se dibujen
*/
this.draw = function(){
	for (var i = 0; i < tiles.length; i++){
		tiles[i].draw(this.gs, i);	
	}
};



/**
*Es el bucle del juego
*
*/
this.loop = function (){
	//llamamos a la funcion cada 1 seg, para que pinte las cartas.
	setInterval(this.draw, 16);													//<------------------------------------------------------------------
};


/**
*Evento que se activa al hacer click en alguna carta
*Cada carta esta identificada por la posicion que ocupa en el array
* Si hay dos cartas volteadas, comprobar si son las mismas.
* En caso afirmativo, se marcan las cartas como encontradas
*  sino son las mismas, ambas se giraran boca abajo.
*/
this.onClick= function (cardID){
	//este evento solo se usa en cartas que no estan en estado "found"
	
	if(cardID >= 0 && cardID != null){ // para evitar errores al dar click fuera del canvas.

	if(semaforo == "verde"){
		if(tiles[cardID].estado == "down"){ // El metodo onClick solo se ejecuta si la carta esta en estado "down"
			num_tiles_up++;
			if(num_tiles_up == 2){
			    semaforo = "rojo";
			    this.segunda = tiles[cardID];
				tiles[cardID].flip();
				
				//Si son ambas cartas iguales, las pongo como encontradas.
				if(this.primera.compareTo(tiles[cardID])){
					this.gs.drawMessage("Match Found!");

					this.num_pares_encontrados = this.num_pares_encontrados + 1;
					//Marcamos las cartas como encontradas.
					this.primera.found();
					tiles[cardID].found();
					
					//Si se han encontrado todas las cartas, mostramos el mensaje "You Win"
					if(this.num_pares_encontrados == this.numCartas){
						this.gs.drawMessage("You Win!!");
					}
					//Habilitamos el uso del metodo onClick.
					semaforo = "verde";
				}
				else{ //Sino son iguales las  giro
					var prim = this.primera;
					var seg = this.segunda;
					
					setTimeout(function(){
						
							prim.flip();
							seg.flip();	
							semaforo = "verde"; // Importante ponerlo aqui, para evitar que se gire una tercera carta.
					}, 1000);
					
					this.gs.drawMessage("Try Again");
					
				}
			//reinicio el numero de cartas boca arriba.
				num_tiles_up = 0;
				
			}else if(num_tiles_up == 1){ //Si solo hay una carta boca arriba, la guardo
			
				this.primera = tiles[cardID];
				this.primera.flip();
			}

		}
	}
}


};
};

/* ==================================== Memory.Card =================================*/

/**
*Constructora que recibe el nombre del sprite que representa la carta.
*Las cartas han de crearse en estado : boca abajo.
*/
var MemoryGameCard = function(sprite){
	this.estado = "down";
	this.sprite = sprite; 




this.getEstado = function(){
	return this.estado;
}

/**
*Da la vuelta a la carta, cambiando el estado del sistema.
*
*/
this.flip = function(){
	if(this.estado == "down"){
		this.estado = "up";
	}else if(this.estado == "up"){
		this.estado = "down";
	}

};

/**
*Marca una carta como encontrado, cambiando el estado de la misma
*
*/
this.found= function(){
		this.estado ="found";

};

/**
*Compara dos cartas
*@return true or false;
*/
this.compareTo = function(otherCard){
	return this.sprite == otherCard.sprite;

};

/**
*Dibuja la carta de acuerdo al estado en el que se encuentra.
*@gs : servidor grafico.
*@pos: Posicion de la carta en el array.
*/
this.draw = function(gs,pos){
	if(tiles[pos].estado == "down"){
		gs.draw("back", pos);
	} else if(tiles[pos].estado == "up" ){
		gs.draw(this.sprite,pos);
	} else if (tiles[pos].estado == "found" ){
		gs.draw(this.sprite,pos);
	}
		

};

};

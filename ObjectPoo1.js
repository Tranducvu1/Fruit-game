class ObjectPool {
      //construtor objectpool
      constructor(ObjectPool){
      this.ObjectPool = ObjectPool;
      this.pool = [];
}
      //get objectpool 
      get(){
      if(this.pool.length >0 ){
            this.pool.pop();
      }
            return new ObjectPool();
      }
            //released objectpool 
      released(){
            this.pool.push();
      }
    //clear objectpool 
      clear(){
            this.pool = [];
      }

      
}
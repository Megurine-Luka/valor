<template>
  <div>
    <m-card :icon="icon" :title="title">
      <div class="nav jc-between fs-xl">
        <div class="nav-item" :class="{active: active===i}" 
        v-for="(category,i) in categories" :key="i" 
        @click="$refs.list.swiper.slideTo(i)">
          <div class="nav-link">{{category.name}}</div>
        </div>
      </div>
      <div>
        <div class="pt-3">
          <swiper ref="list" :options="{autoHeight:true}"
          @slide-change="()=>active = $refs.list.swiper.realIndex">
            <swiper-slide v-for="(category,i) in categories" :key="i">
                <!-- 具名插槽 -->
                <slot name="items" :category="category"></slot>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </m-card>
  </div>
</template>

<script>
export default {
    props:{
        icon:{type:String,required:true},
        title:{type:String,required:true},
        categories:{type:Array,required:true},
    },
    data(){
        return{
            active:0
        }
    }
}
</script>
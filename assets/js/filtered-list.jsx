/**
 * Created by PhpStorm.
 * Author:   ershov-ilya
 * GitHub:   https://github.com/ershov-ilya/
 * About me: http://about.me/ershov.ilya (EN)
 * Website:  http://ershov.pw/ (RU)
 * Date: 09.09.2015
 * Time: 13:28
 */

var FilteredList = React.createClass({
    handleFilterOpenClose: function(e){
     	    var $this=$(e.target);
     	    var state=$this.data('open-state');
     		if(!state){
     		   $this.parents(".drop-filter").find("UL").fadeIn('fast');
     		   $this.data('open-state',1);
     		}
     		else{
     		   $this.parents(".drop-filter").find("UL").fadeOut('fast');
     		   $this.data('open-state',0);
     		}
     		state = !state;
     	   return false;
    },

     handleClick: function(e) {
        e.preventDefault();

        var option=
        console.log('target');
        console.log($(e.target).get(0));
        // Ajax details ommitted since we never get here via onClick
         $.get('http://synergy.ru/api/ajax/filter/get-sections/?course=9574', function(response) {
            response=JSON.parse(response);
             if (this.isMounted()) {
                 this.setState({
                     filters: response
                 });
             }
         }.bind(this));

      },


    getInitialState: function(){
        return {
            filters:{
                sections:[],
                course:[]
            },
            initialItems: [
                "Apples",
                "Broccoli",
                "Chicken",
                "Duck",
                "Eggs",
                "Fish",
                "Granola",
                "Hash Browns"
            ],
            items: []
        }
    },

    componentWillMount: function(){ // Функция инциализации
        this.setState({items: this.state.initialItems})
    },

    componentDidMount: function() {
         $.get('http://synergy.ru/api/ajax/filter/get-sections/', function(response) { //?course=9574
            response=JSON.parse(response);
             if (this.isMounted()) {
                 this.setState({
                     filters: response
                 });
             }
         }.bind(this));

        // Обработка событий
        $('#FilteredListApp').on('click', '.drop-link', this.handleFilterOpenClose);
        $('#FilteredListApp').on('click', '.drop-list a', this.handleClick.bind(this));
    },


    render: function(){
        console.log('Render event');
        console.log(this.state.filters);
        return (
            <section className="filter clearfix">
                <div className="filter-left">
                    <div className="themes-title">Фильтры</div>
                    <div className="drop-filter themes-filter">
                        <a href="#" className="drop-link">Раздел</a>
                        <ul className="drop-list">
                            <li><a href="" data-option="0">Раздел</a></li>
                            {
                                this.state.filters.sections.map(function(item) {
                                    return <li><a href="" data-option={item.id} onClick={this.handleClick}>{item.pagetitle}</a></li>
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div className="filter-right">
                    <span className="sorting-filter-title">сортировать</span>
                    <ul className="sorting-filter">
                        <li><a href="" data-option="publishedon">по дате</a></li>
                        <li><a href="" data-option="speaker">по автору</a></li>

                        <li><a href="" data-option="view_count">по популярности</a></li>
                    </ul>
                    <ul className="view-filter">
                        <li><a href="" className="rows current"></a></li>
                        <li><a href="" className="column"></a></li>
                    </ul>
                </div>
            </section>
        );
    },
    /*
            <div className="filter-list">
                <input type="text" placeholder="Search" onChange={this.filterList}/>
                <List items={this.state.items}/>
            </div>
    */
    // Custom functions
    filterList: function(event){
         var updatedList = this.state.initialItems;
         updatedList = updatedList.filter(function(item){
             return item.toLowerCase().search(
                     event.target.value.toLowerCase()) !== -1;
         });
         this.setState({items: updatedList});
     },

     FilterClick: function(e){
        alert('!!!');
         e.preventDefault();
         e.stopPropagation();
         e.nativeEvent.stopImmediatePropagation();
         console.log('function FilterClick');
//         $.get('http://synergy.ru/api/ajax/filter/get-sections/?course=9574', function(response) {
//            response=JSON.parse(response);
//             if (this.isMounted()) {
//                 this.setState({
//                     filters: response
//                 });
//             }
//         }.bind(this));
         return false;
     }
});



var List = React.createClass({
    render: function(){
        return (
            <ul>
                {
                    this.props.items.map(function(item) {
                        return <li key={item}>{item}</li>
                    })
                }
            </ul>
        )
    }
});

if(typeof FilteredList != 'undefined') {
    React.render(<FilteredList/>, document.getElementById('FilteredListApp'));
}

/*
    <!-- Filter -->
    <section class="filter clearfix">
        <div class="filter-left">
            <div class="themes-title">Фильтры</div>
            <div class="drop-filter themes-filter">
                <a href="#" class="drop-link">Раздел</a>
                <ul>
                    <li><a href="" data-option="0">Раздел</a></li>
                </ul>
            </div>
        </div>
        <div class="filter-right">
            <span class="sorting-filter-title">сортировать</span>
            <ul class="sorting-filter">
                <li><a href="" data-option="publishedon">по дате</a></li>
                <li><a href="" data-option="speaker">по автору</a></li>

                <li><a href="" data-option="view_count">по популярности</a></li>
            </ul>
            <ul class="view-filter">
                <li><a href="" class="rows current"></a></li>
                <li><a href="" class="column"></a></li>
            </ul>
        </div>
    </section>
    <!-- /Filter -->

*/


/**
 * Created by PhpStorm.
 * Author:   ershov-ilya
 * GitHub:   https://github.com/ershov-ilya/
 * About me: http://about.me/ershov.ilya (EN)
 * Website:  http://ershov.pw/ (RU)
 * Date: 09.09.2015
 * Time: 13:28
 */
function closedata(){
    $(".drop-filter ul").fadeOut('fast').data('open-state',0);
}

var FilteredList = React.createClass({
    DEBUG: true,



    handleFilterOpenClose: function(e){
     	    var $this=$(e.target);
     	    var state=$this.data('open-state');
     		if(!state){
     		   $this.parents(".drop-filter").find("UL").fadeIn('fast').data('open-state',1);
     		}
     		else{
     		   $this.parents(".drop-filter").find("UL").fadeOut('fast').data('open-state',0);
     		}
     		state = !state;
     	   return false;
    },

     handleSectionClick: function(e) {
        e.preventDefault();
        var $target=$(e.target);
        var option=$target.data('option');

        console.log('option');
        console.log(option);
        // Ajax details ommitted since we never get here via onClick
         $.get('http://synergy.ru/api/ajax/filter/get-sections/?course='+option, function(response) {
            response=JSON.parse(response);
             if (this.isMounted()) {
                 this.setState({
                     data: response
                 });
             }
         }.bind(this));

      },

     handleCourseClick: function(e) {
        e.preventDefault();
        console.log('course click');
      },


    getInitialState: function(){
        return {
            data:{
                sections:[],
                course:[]
            }
        }
    },

    componentWillMount: function(){ // Функция инциализации
        //this.setState({items: this.state.initialItems})
    },

    componentDidMount: function() {
         $.get('http://synergy.ru/api/ajax/filter/get-sections/', function(response) { //?course=9574
            response=JSON.parse(response);
            if(typeof response.sections == 'undefined') response.sections = [];
            if(typeof response.course == 'undefined') response.course = [];

             if (this.isMounted()) {
                 this.setState({
                     data: response
                 });
             }
         }.bind(this));

        // Обработка событий
        $('#FilteredListApp').on('click', '.drop-link', this.handleFilterOpenClose);
        $('#FilteredListApp').on('click', '.section-filter ul a', this.handleSectionClick.bind(this));
        $('#FilteredListApp').on('click', '.course-filter ul a', this.handleCourseClick.bind(this));
    },


    render: function(){
        if(this.DEBUG) {
            console.log('Render event');
            console.log(this.state.data);
        }

        return (
            <section className="filter clearfix">
                <div className="filter-left">
                    <div className="themes-title">Фильтры</div>
                    <div className="drop-filter themes-filter section-filter">
                        <a href="#" className="drop-link">Раздел</a>
                        <ul className="drop-list">
                            <li><a href="" data-option="0">Раздел</a></li>
                            {
                                this.state.data.sections.map(function(item) {
                                    return <li><a href="" data-option={item.id}>{item.pagetitle}</a></li>
                                })
                            }
                        </ul>
                    </div>
                    <div className="drop-filter themes-filter course-filter">
                        <a href="#" className="drop-link">Курс</a>
                        <ul className="drop-list">
                            <li><a href="" data-option="0">Курс</a></li>
                            {
                                this.state.data.course.map(function(item) {
                                    return <li><a href="" data-course-id={item.id}>{item.pagetitle}</a></li>
                                })
                            }
                        </ul>
                    </div>
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


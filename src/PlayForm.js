import React from 'react';
import classnames from 'classnames';


class PlayForm extends React.Component {
  state = {
    _id: this.props.play ? this.props.play._id : null,
    title: this.props.play ? this.props.play.title : '',
    cover: this.props.play ? this.props.play.cover : '',
    errors: {},
    loading: false
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      _id: nextProps.play._id,
      title: nextProps.play.title,
      cover: nextProps.play.cover
    })
  }



  handleChange = (e) => {
    if(!!this.state.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.errors);
      delete errors[e.target.name];
      this.setState({
        [e.target.name]: e.target.value,
        errors
      });
    } else {
      this.setState({ [e.target.name]: e.target.value});
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    //validation
    let errors = {};
    if(this.state.title === '') errors.title = "Can't be empty";
    if(this.state.cover === '') errors.cover = "Can't be empty";
    this.setState({ errors });
    const isValid = Object.keys(errors).length === 0

    if(isValid) {
      const { _id, title, cover } =  this.state;
      this.setState({ loading: true })
      this.props.savePlay({ _id, title, cover})
        .catch((err) => err.response.json().then(({errors}) => this.setState({ errors, loading: false })))
    }
  }

  render() {
    const form = (
      <form className={classnames('ui', 'form', 'add-play-form', { loading: this.state.loading })} onSubmit={this.handleSubmit}>
      <h1>Play Editor</h1>

      {!!this.state.errors.global && <div className="ui negative message"><p>{this.state.errors.global}</p></div>}

      <div className={classnames('field', { error: !!this.state.errors.title})}>
        <h3 className="plays-list-label" htmlFor="title">Name of Play</h3>
        <input
          name="title"
          value={this.state.title}
          onChange={this.handleChange}
          id="title"
        />
        <span>{this.state.errors.title}</span>

      </div>

      <div className={classnames('field', { error: !!this.state.errors.cover})}>
        <h3 className="plays-list-label" htmlFor="cover">Image URL</h3>
        <input
        name="cover"
        value={this.state.cover}
        onChange={this.handleChange}
          id="cover"
        />
        <span>{this.state.errors.cover}</span>
      </div>

      <div className="field">
        {this.state.cover !== '' && <img src={this.state.cover} alt="cover" className="ui small bordered image"/>}
      </div>

      <div className="field">
        <button className="ui primary button">Save</button>
      </div>
      </form>
    )
    return (
      <div>
        { form }
      </div>
    );
  }
}

export default PlayForm;

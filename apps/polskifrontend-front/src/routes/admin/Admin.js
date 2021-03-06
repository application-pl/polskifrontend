import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import style from './Admin.styl';
import { connect } from 'react-redux';
import history from '../../core/history';
import mapStateToProps from '../../core/redux/mapStateToProps';
import mapDispatchToProps from '../../core/redux/mapDispatchToProps';
import AddBlog from './parts/AddBlog';
import BlogList from './parts/BlogList';
import Message from '../../components/Indicators/Message';
import Confirm from '../../components/Modals/Confirm';
import HeaderSettings from '../../components/Layout/HeaderSettings';

class Admin extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    adminBlogsState: PropTypes.object.isRequired,
    adminState: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    description: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  };

  componentDidMount() {
    const { actions: { getAdminBlogList }, adminBlogsState: blogListLoading } = this.props;
    if (blogListLoading) {
      getAdminBlogList();
    }
  }

  componentDidUpdate() {
    const { adminState: { tokenExpired } } = this.props;

    if (tokenExpired) {
      // redirect to login
      history.push('/login');
    }
  }

  onDeleteClick(id, event) {
    event.preventDefault();
    const { actions: { deleteBlogRequest } } = this.props;
    deleteBlogRequest(id);
  }

  onEditClick(id, event) {
    event.preventDefault();
    console.log(id); // eslint-disable-line
  }

  onNameChange(event) {
    event.preventDefault();
    const { actions: { newBlogNameChanged } } = this.props;
    newBlogNameChanged(event.target.value);
  }

  onUrlChange(event) {
    event.preventDefault();
    const { actions: { newBlogUrlChanged } } = this.props;
    newBlogUrlChanged(event.target.value);
  }

  onRssChange(event) {
    event.preventDefault();
    const { actions: { newBlogRssChanged } } = this.props;
    newBlogRssChanged(event.target.value);
  }

  onAddFormSubmit(event) {
    event.preventDefault();

    const {
      actions: {
        addBlog
      },
      adminBlogsState: {
        newBlogName,
        newBlogNameValid,
        newBlogUrl,
        newBlogUrlValid,
        newBlogRss,
        newBlogRssValid
      } } = this.props;

    if (newBlogNameValid && newBlogUrlValid && newBlogRssValid) {
      addBlog({ name: newBlogName, href: newBlogUrl, rss: newBlogRss });
    }
  }

  onDeleteCancelClick() {
    const { actions: { deleteBlogRequestCancel } } = this.props;
    deleteBlogRequestCancel();
  }

  onDeleteConfirmClick() {
    const { actions: { deleteBlog }, adminBlogsState: { deleteBlogId } } = this.props;
    deleteBlog(deleteBlogId);
  }

  onRefreshClick(id, event) {
    event.preventDefault();
    const { actions: { refreshBlog } } = this.props;
    refreshBlog(id);
  }

  onSlugRefreshClick(event) {
    event.preventDefault();
    const { actions: { refreshSlug } } = this.props;
    refreshSlug();
  }

  onFaviconRefresh(event) {
    event.preventDefault();
    const { actions: { refreshFavicons } } = this.props;
    refreshFavicons();
  }

  render() {
    const { adminBlogsState: {
      blogList,
      blogListLoading,
      blogListError,
      newBlogName,
      newBlogUrl,
      newBlogRss,
      newBlogNameValid,
      newBlogNameDirty,
      newBlogUrlValid,
      newBlogUrlDirty,
      newBlogRssValid,
      newBlogRssDirty,
      addBlogLoading,
      addBlogError,
      addBlogErrorMessage,
      deleteBlogRequested,
      refreshBlogLoading,
      refreshSlugLoading,
      refreshFaviconLoading
    } } = this.props;
    const { context, description, title } = this.props;
    let errorMessage = blogListError ? 'Błąd pobierania blogów - spróbuj odświezyć stronę' : '';
    const shouldCleanUp = newBlogName === '' && newBlogUrl === '' && newBlogRss === '';

    if (blogListError === false && addBlogError) {
      errorMessage = addBlogErrorMessage;
    }

    return (
      <div className={style.container}>
        <HeaderSettings currentPath={context.path} description={description} title={title} />
        <AddBlog onNameChange={this.onNameChange.bind(this)}
                 onUrlChange={this.onUrlChange.bind(this)}
                 onRssChange={this.onRssChange.bind(this)}
                 onFormSubmit={this.onAddFormSubmit.bind(this)}
                 onSlugRefresh={this.onSlugRefreshClick.bind(this)}
                 onFaviconRefresh={this.onFaviconRefresh.bind(this)}
                 nameValid={newBlogNameValid}
                 nameDirty={newBlogNameDirty}
                 urlValid={newBlogUrlValid}
                 urlDirty={newBlogUrlDirty}
                 rssValid={newBlogRssValid}
                 rssDirty={newBlogRssDirty}
                 shouldCleanUp={shouldCleanUp}
                 addBlogLoading={addBlogLoading || refreshSlugLoading || refreshFaviconLoading}
                 newBlogName={newBlogName}
                 newBlogUrl={newBlogUrl}
                 newBlogRss={newBlogRss}
        />
        <BlogList blogList={blogList}
                  blogListLoading={blogListLoading}
                  onDeleteClick={this.onDeleteClick.bind(this)}
                  onEditClick={this.onEditClick.bind(this)}
                  onRefreshClick={this.onRefreshClick.bind(this)}
                  refreshLoading={refreshBlogLoading || refreshSlugLoading || refreshFaviconLoading}
        />
        <Confirm question="Czy jesteś pewien, że chcesz usunąć bloga?" isVisible={deleteBlogRequested} onCancelClick={this.onDeleteCancelClick.bind(this)} onConfirmClick={this.onDeleteConfirmClick.bind(this)} />
        <Message type="alert" message={errorMessage} isVisible={blogListError || addBlogError} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(Admin));

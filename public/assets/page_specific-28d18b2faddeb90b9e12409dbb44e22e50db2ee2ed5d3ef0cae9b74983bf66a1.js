var ProfileEdit = {
  init: function() {
    /*** Simply return if it's not User profile edit page ***/
    if (!$('[data-page="users-edit"]').length > 0) {
      return;
    }
    $("#user_avatar").change(function(){
      ProfileEdit.readURL(this);
    });
  },

  readURL: function(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $('#change-avatar').attr('style', "background-image: url('" + e.target.result + "')");
      }

      reader.readAsDataURL(input.files[0]);
    }
  }
}

$(document).ready( ProfileEdit.init );
$(document).on( 'page:load', ProfileEdit.init );
var Editor = {
  init: function() {
    /*** Simply return if it's not editor page ***/
    if (!$('[data-page="main-editor"]').length > 0) {
      return;
    }

    var editor = new MediumEditor('.medium-editable', {
      placeholder: {
        text: "Write..."
      }
    });

    $('.medium-editable').mediumInsert({
      editor: editor,
      addons: {
        images: {
          fileUploadOptions: { // TODO: figure out how to upload pictures to AS3
            url: $('.editor-form').attr('action'),
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            method: 'PATCH'
          }
        },
        embeds: {
          oembedProxy: null
        }
      }
    });

    // preload tags if its edit.
    var tag_string = $('[data-behavior="tags"]').data("tags");
    var tags = tag_string.length > 0 ? tag_string.split(', ') : ['Story', 'Music'];

    var my_taggle = new Taggle('js-taggle', {
      duplicateTagClass: 'bounce',
      tags: tags,
      preserveCase: true
    });

    // FIXME: is there a better way to do this?
    $('[data-behavior="publish-button"').hover(function() {
      $('#post_all_tags').val(my_taggle.getTagValues());
    });

    $("#post_picture").change(function(){
      Editor.readURL(this);
      $('#existing-img-previewer').addClass('hidden');
      $('.picture_upload').addClass('active');
      $('.file-upload-previewer').removeClass('hidden');
    });

    /*** Autosave ***/
    $('[data-behavior="autosave"]').autoSave(function() {
      $('[data-behavior="editor-message"]').text('Saving...');
      $('#post_all_tags').val(my_taggle.getTagValues());
      Editor.postAutosave($('.editor-form').attr('action'),
                   $('input[name="_method"]').val(),
                   $('#post_title').val(),
                   $('#post_body').val(),
                   $('#post_all_tags').val()
                  );
    }, 500);

    /*** Form submit ***/
    $('[data-behavior="publish-button"]').on('click', function() {
      $('.editor-form').submit();
    });

    $('.publish-dropdown').on('click', function(e) {
      e.stopPropagation();
    });

  }, 

  readURL: function(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $('#image_preview').attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
    }
  },

  postAutosave: function(url, method, title, body, all_tags) {
    $.ajax({
      url: '/api' + url,
      dataType: "script",
      method: method || "POST",
      data: {
        post: {
          title: title,
          body: body,
          all_tags: all_tags
        }
      },
      success: function() { console.log('autosave successful'); }
    });
  }

};

$(document).ready( Editor.init );
$(document).on( 'page:load', Editor.init );
var InlineEditor = {
  init: function() {
    /*** Simply return if it's not dashboards#show page ***/
    if (!$('[data-page="inline-editor"]').length > 0) {
      return;
    }
    var editor = new MediumEditor('.medium-editable', {
      placeholder: {
        text: "Write..."
      }
    });

    editor.subscribe('focus', function() {
      $('#inline-editor').addClass('active');
    });

    $('[data-behavior="editor-cancel"]').click(function(e) {
      e.preventDefault();
      $('#inline-editor').removeClass('active');
      InlineEditor.clearEditor(editor);
    });
  },

  clearEditor: function(editor) {
    editor.destroy();
    $('#editor-body').val('');
    editor.setup();
    editor.subscribe('focus', function() {
      $('#inline-editor').addClass('active');
    });
  }
};

$(document).ready( InlineEditor.init );
$(document).on( 'page:load', InlineEditor.init );
var PostMetadataBar = {
  init: function() {
    if (!$('[data-page="post-metadata-bar"]').length > 0) {
      return;
    }

    var lastScrollTop = 0;
    var $metadataBar = $('[data-behavior="animated-metadata"]');
    $(window).scroll(function(event) {
      var st = $(this).scrollTop();

      if (st > lastScrollTop) {
        // downscroll event
        $metadataBar.removeClass('is-inView');
        $metadataBar.addClass('is-hidden');
      } else {
        // upscroll event
        $metadataBar.removeClass('is-hidden');
        $metadataBar.addClass('is-inView');
      }
      lastScrollTop = st;
    });
  }
};

$(document).ready( PostMetadataBar.init );
$(document).on( 'page:load', PostMetadataBar.init );
var ResponseEditor = {
  init: function() {
    if (!$('[data-behavior="response-editor"]').length > 0) {
      return;
    }

    var editor = new MediumEditor('.medium-editable', {
      placeholder: {
        text: "Write a response"
      }
    });

    editor.subscribe('focus', function() {
      $('[data-behavior="response-editor"]').addClass('active');
    });

    $('[data-behavior="editor-cancel"]').click(function(e) {
      e.preventDefault();
      $('[data-behavior="response-editor"]').removeClass('active');
      ResponseEditor.clearEditor(editor);
    });
  },

  clearEditor: function(editor) {
    editor.destroy();
    $('#editor-body').val('');
    editor.setup();
    editor.subscribe('focus', function() {
      $('[data-behavior="response-editor"]').addClass('active');
    });
  }
};

$(document).ready( ResponseEditor.init );
$(document).on( 'page:load', ResponseEditor.init );

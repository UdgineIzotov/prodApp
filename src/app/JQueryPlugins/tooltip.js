/**
 * plugin tooltip. Sets tooltip to all tags with title
 * @memberof module:JQueryPlugins
 * @type {JQueryFunction}
 * @name tooltip
 */
$.fn.tooltip = function () {
    let tooltip = {};
    $('.tooltip').remove();

    $('[title]')
        .hover(
            function (e) {
                tooltip = document.createElement('div');
                $(tooltip).addClass('tooltip')
                    .text($(this).attr('title'));
                $('body').append(tooltip);

                const coords = e.target.getBoundingClientRect();

                const cX = `${coords.left + coords.width / 2 - 20}px`;
                const cY = `${coords.top - 45}px`;

                $(tooltip).css({ left: cX, top: cY });
            },
            () => {
                $(tooltip).remove();
            }
        );
};

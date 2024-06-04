import { Component } from 'solid-js'

import './style/about.scss'

export const About: Component = props => {
    return (
        <section class='about2' id='about'>
            <iframe src='https://my.spline.design/untitled-c7de4eec8d45ade0034aceb60e77aa18/'></iframe>
            <aside class='data'>
                <h4 class='head title_smaller'>درباره ما</h4>
                <h3 class='section_title header'>چرا دریم پی؟</h3>
                <p class='title_smaller subheader'>
                    با دیریم پی، بهترین سرویس‌های اکانت اسپاتیفای، اپل موزیک،
                    دیسکورد و ... را تجربه کن! ارائه‌دهنده بهترین اکانت‌های
                    محبوب اینترنت با کیفیت برتر و قیمت مناسب. انتخاب بهتر، سرعت
                    بیشتر! با اعتماد به دیریم پی، مشتریان دسترسی آسان و امن به
                    اکانت‌های مورد نیاز خود را خواهند داشت و از امکانات ویژه‌ی
                    هر یک از سرویس‌ها بهره‌مند خواهند شد.
                </p>
            </aside>
            <div class='bottom'></div>
        </section>
    )
}

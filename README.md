# Math API

Place LaTeX Math equation on anywhere as `<img>` tag.

https://math.giainhanh.vn

## Usage

### Image format (svg or png)

#### Normal
```
<img src="https://math.giainhanh.vn/img?from=\log\prod^N_{i}x_{i}=\sum^N_i\log{x_i}" />
```

#### Inline
```
<img src="https://math.giainhanh.vn/img?inline=\log\prod^N_{i}x_{i}=\sum^N_i\log{x_i}" />
```
### Mathml format

```
curl https://math.giainhanh.vn/mathml?from=\log\prod^N_{i}x_{i}=\sum^N_i\log{x_i}
```

## Option

### **.svg** or **.png** extension

URL ends with **.svg** extension will be treated as a normal math formula.

Some Markdown blog services won't treat image tags correctly whose URL has no any image extension in it. This option may give fixes to these situations.
```
<img src="https://math.giainhanh.vn/img?from=\log\prod^N_{i}x_{i}=\sum^N_i\log{x_i}.png" />
```
### Optional input format type
Math-api support latex, asciimath and mathml
```
<img src="https://math.giainhanh.vn/img?from=root(4)(x)&type=asciimath" />
```
### Output format type:
+ svg
+ png
+ mathml

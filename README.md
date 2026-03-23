# In-browser Object Detection with Transformers.js

A [Next.js](https://nextjs.org) demo that runs AI object detection **entirely in the browser** — no server, no API, no data leaves your device.

## How it works

1. **Model download** — click _Download Model_ to fetch the [Xenova/detr-resnet-50](https://huggingface.co/Xenova/detr-resnet-50) weights from Hugging Face. The model is cached in the browser after the first download.
2. **Image upload** — drag & drop (or click to select) any image. Only JPEG/PNG up to 1 MB are accepted.
3. **Detection** — the image is passed to a [Web Worker](src/lib/worker.ts) where [Transformers.js](https://huggingface.co/docs/transformers.js/index) runs the DETR ResNet-50 model and returns a list of detected objects with bounding boxes and confidence scores.
4. **Results** — the image is displayed on the left with coloured bounding boxes drawn over each detected object. The right panel lists every detected object with its confidence score.

The model supports 80 object categories from the COCO 2017 dataset.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
